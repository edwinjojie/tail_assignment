from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tail_assignment.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

MAINTENANCE_BASES = ["Mumbai", "Delhi"]

class Aircraft(db.Model):
    tail_number = db.Column(db.String, primary_key=True)
    subtype = db.Column(db.String)
    capacity = db.Column(db.Integer)
    fuel_efficiency = db.Column(db.Float)
    current_location = db.Column(db.String)
    available_from = db.Column(db.DateTime)
    hours_flown = db.Column(db.Float, default=0)
    total_flights = db.Column(db.Integer, default=0)

class Flight(db.Model):
    flight_id = db.Column(db.String, primary_key=True)
    route = db.Column(db.String)
    origin = db.Column(db.String)
    destination = db.Column(db.String)
    distance = db.Column(db.Float)
    dep_time = db.Column(db.DateTime)
    arr_time = db.Column(db.DateTime)
    required_subtype = db.Column(db.String)
    passengers = db.Column(db.Integer)
    assigned_tail = db.Column(db.String, db.ForeignKey('aircraft.tail_number'))
    assigned_crew = db.Column(db.String, db.ForeignKey('crew.crew_id'))
    co2_emitted = db.Column(db.Float, default=0)

class Crew(db.Model):
    crew_id = db.Column(db.String, primary_key=True)
    qualifications = db.Column(db.String)
    current_location = db.Column(db.String)
    available_from = db.Column(db.DateTime)
    duty_hours = db.Column(db.Float, default=0)
    total_flights = db.Column(db.Integer, default=0)

def get_weather_factor(timestamp):
    hour = timestamp.hour
    if 6 <= hour < 12:
        return 0.9
    elif 12 <= hour < 18:
        return 1.1
    else:
        return 1.0

def needs_maintenance(aircraft):
    return aircraft.hours_flown >= 20

def optimize_aircraft_assignments():
    now = datetime.now()
    flights = Flight.query.filter(Flight.dep_time > now).order_by(Flight.dep_time).all()
    aircraft = Aircraft.query.all()

    if not flights or not aircraft:
        return {'assignments': [], 'alerts': ['No flights or aircraft available'], 'unassigned_flights': [f.flight_id for f in flights]}

    for f in flights:
        f.assigned_tail = None
        f.assigned_crew = None
        f.co2_emitted = 0
    db.session.commit()

    manager = pywrapcp.RoutingIndexManager(len(flights), len(aircraft), [i for i in range(len(aircraft))])
    routing = pywrapcp.RoutingModel(manager)

    def time_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        if from_node < len(flights) and to_node < len(flights):
            f1 = flights[from_node]
            f2 = flights[to_node]
            if f2.origin == f1.destination and f2.dep_time >= f1.arr_time + timedelta(hours=1):
                return int((f2.dep_time - (f1.arr_time + timedelta(hours=1))).total_seconds() / 60)
            return 1000000
        elif from_node >= len(flights):
            a = aircraft[from_node - len(flights)]
            f = flights[to_node]
            if a.current_location == f.origin and a.available_from <= f.dep_time:
                return 0
            return 1000000
        elif to_node >= len(flights):
            return 0
        return 1000000

    transit_callback_index = routing.RegisterTransitCallback(time_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    routing.AddDimension(
        transit_callback_index,
        0,
        1000000,
        True,
        'Time'
    )
    time_dimension = routing.GetDimensionOrDie('Time')

    for i, f in enumerate(flights):
        index = manager.NodeToIndex(i)
        time_dimension.CumulVar(index).SetRange(
            int((f.dep_time - now).total_seconds() / 60),
            int((f.dep_time - now).total_seconds() / 60)
        )

    for a_idx, a in enumerate(aircraft):
        index = routing.Start(a_idx)
        time_dimension.CumulVar(index).SetValue(int((max(a.available_from, now) - now).total_seconds() / 60))

    def co2_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        if to_node < len(flights):
            f = flights[to_node]
            a = aircraft[routing.VehicleVar(from_index)]
            if f.required_subtype == a.subtype and f.passengers <= a.capacity:
                weather_factor = get_weather_factor(f.dep_time)
                return int(a.fuel_efficiency * f.distance * weather_factor * 1000)
            return 1000000
        return 0

    co2_callback_index = routing.RegisterTransitCallback(co2_callback)
    routing.AddDimension(co2_callback_index, 0, 1000000, True, 'CO2')
    co2_dimension = routing.GetDimensionOrDie('CO2')

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    solution = routing.SolveWithParameters(search_parameters)

    assignments = []
    alerts = []
    unassigned_flights = [f.flight_id for f in flights]

    if solution:
        for a_idx in range(len(aircraft)):
            a = aircraft[a_idx]
            index = routing.Start(a_idx)
            route_co2 = 0
            while not routing.IsEnd(index):
                node = manager.IndexToNode(index)
                if node < len(flights):
                    f = flights[node]
                    if f.required_subtype == a.subtype and f.passengers <= a.capacity:
                        f.assigned_tail = a.tail_number
                        weather_factor = get_weather_factor(f.dep_time)
                        co2 = a.fuel_efficiency * f.distance * weather_factor
                        f.co2_emitted = co2
                        a.total_flights += 1
                        route_co2 += co2
                        assignments.append({
                            'flight_id': f.flight_id,
                            'tail_number': a.tail_number,
                            'crew_id': None,
                            'route': f.route,
                            'dep_time': f.dep_time.isoformat(),
                            'arr_time': f.arr_time.isoformat(),
                            'co2_emitted': co2
                        })
                        if f.flight_id in unassigned_flights:
                            unassigned_flights.remove(f.flight_id)
                index = solution.Value(routing.NextVar(index))
            if needs_maintenance(a):
                alerts.append({'type': 'maintenance', 'message': f'Aircraft {a.tail_number} needs maintenance ({a.hours_flown} hours flown)'})

    db.session.commit()
    return {'assignments': assignments, 'alerts': alerts, 'unassigned_flights': unassigned_flights}

def assign_crews(assignments):
    crews = Crew.query.all()
    flights = Flight.query.filter(Flight.assigned_tail.isnot(None), Flight.assigned_crew.is_(None)).all()
    updated_assignments = assignments.copy()
    crew_alerts = []
    for f in flights:
        assigned = False
        for c in crews:
            qualifications = c.qualifications.split(',')
            if (
                f.required_subtype in qualifications and
                c.current_location == f.origin and
                c.available_from <= f.dep_time and
                c.duty_hours + (f.arr_time - f.dep_time).total_seconds() / 3600 <= 12
            ):
                f.assigned_crew = c.crew_id
                c.current_location = f.destination
                c.available_from = f.arr_time + timedelta(hours=8)
                c.duty_hours += (f.arr_time - f.dep_time).total_seconds() / 3600
                c.total_flights += 1
                for assignment in updated_assignments:
                    if assignment['flight_id'] == f.flight_id:
                        assignment['crew_id'] = c.crew_id
                db.session.commit()
                assigned = True
                break
        if not assigned:
            crew_alerts.append({'type': 'crew', 'message': f'No crew available for {f.flight_id}'})
    return updated_assignments, crew_alerts

@app.route('/aircraft', methods=['GET'])
def get_aircraft():
    aircraft = Aircraft.query.all()
    return jsonify([{
        'tail_number': a.tail_number,
        'subtype': a.subtype,
        'capacity': a.capacity,
        'fuel_efficiency': a.fuel_efficiency,
        'current_location': a.current_location,
        'available_from': a.available_from.isoformat(),
        'hours_flown': a.hours_flown,
        'total_flights': a.total_flights
    } for a in aircraft])

@app.route('/aircraft/<tail_number>', methods=['GET'])
def get_aircraft_details(tail_number):
    a = Aircraft.query.get(tail_number)
    if a:
        trips = Flight.query.filter_by(assigned_tail=tail_number).all()
        return jsonify({
            'tail_number': a.tail_number,
            'subtype': a.subtype,
            'capacity': a.capacity,
            'fuel_efficiency': a.fuel_efficiency,
            'current_location': a.current_location,
            'available_from': a.available_from.isoformat(),
            'hours_flown': a.hours_flown,
            'total_flights': a.total_flights,
            'trips': [{
                'flight_id': t.flight_id,
                'route': t.route,
                'dep_time': t.dep_time.isoformat(),
                'arr_time': t.arr_time.isoformat(),
                'co2_emitted': t.co2_emitted
            } for t in trips]
        })
    return jsonify({'error': 'Aircraft not found'}), 404

@app.route('/aircraft', methods=['POST'])
def add_aircraft():
    data = request.json
    try:
        new_aircraft = Aircraft(
            tail_number=data['tail_number'],
            subtype=data['subtype'],
            capacity=data['capacity'],
            fuel_efficiency=data['fuel_efficiency'],
            current_location=data['current_location'],
            available_from=datetime.fromisoformat(data['available_from'])
        )
        db.session.add(new_aircraft)
        db.session.commit()
        return jsonify({'message': 'Aircraft added'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/flights', methods=['GET'])
def get_flights():
    flights = Flight.query.all()
    return jsonify([{
        'flight_id': f.flight_id,
        'route': f.route,
        'origin': f.origin,
        'destination': f.destination,
        'distance': f.distance,
        'dep_time': f.dep_time.isoformat(),
        'arr_time': f.arr_time.isoformat(),
        'required_subtype': f.required_subtype,
        'passengers': f.passengers,
        'assigned_tail': f.assigned_tail,
        'assigned_crew': f.assigned_crew,
        'co2_emitted': f.co2_emitted
    } for f in flights])

@app.route('/flights/<flight_id>', methods=['GET'])
def get_flight_details(flight_id):
    f = Flight.query.get(flight_id)
    if f:
        a = Aircraft.query.get(f.assigned_tail)
        c = Crew.query.get(f.assigned_crew)
        return jsonify({
            'flight_id': f.flight_id,
            'route': f.route,
            'origin': f.origin,
            'destination': f.destination,
            'distance': f.distance,
            'dep_time': f.dep_time.isoformat(),
            'arr_time': f.arr_time.isoformat(),
            'required_subtype': f.required_subtype,
            'passengers': f.passengers,
            'assigned_tail': f.assigned_tail,
            'assigned_crew': f.assigned_crew,
            'co2_emitted': f.co2_emitted,
            'aircraft_details': {
                'tail_number': a.tail_number,
                'subtype': a.subtype,
                'capacity': a.capacity,
                'fuel_efficiency': a.fuel_efficiency
            } if a else None,
            'crew_details': {
                'crew_id': c.crew_id,
                'qualifications': c.qualifications.split(','),
                'duty_hours': c.duty_hours
            } if c else None
        })
    return jsonify({'error': 'Flight not found'}), 404

@app.route('/flights', methods=['POST'])
def add_flight():
    data = request.json
    try:
        new_flight = Flight(
            flight_id=data['flight_id'],
            route=data['route'],
            origin=data['origin'],
            destination=data['destination'],
            distance=data['distance'],
            dep_time=datetime.fromisoformat(data['dep_time']),
            arr_time=datetime.fromisoformat(data['arr_time']),
            required_subtype=data['required_subtype'],
            passengers=data['passengers']
        )
        db.session.add(new_flight)
        db.session.commit()
        result = optimize_aircraft_assignments()
        assignments, crew_alerts = assign_crews(result['assignments'])
        result['alerts'].extend(crew_alerts)
        result['assignments'] = assignments
        return jsonify(result), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/crews', methods=['GET'])
def get_crews():
    crews = Crew.query.all()
    return jsonify([{
        'crew_id': c.crew_id,
        'qualifications': c.qualifications.split(','),
        'current_location': c.current_location,
        'available_from': c.available_from.isoformat(),
        'duty_hours': c.duty_hours,
        'total_flights': c.total_flights
    } for c in crews])

@app.route('/crews', methods=['POST'])
def add_crew():
    data = request.json
    try:
        new_crew = Crew(
            crew_id=data['crew_id'],
            qualifications=','.join(data['qualifications']),
            current_location=data['current_location'],
            available_from=datetime.fromisoformat(data['available_from'])
        )
        db.session.add(new_crew)
        db.session.commit()
        return jsonify({'message': 'Crew added'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/statistics', methods=['GET'])
def get_statistics():
    total_co2 = sum(f.co2_emitted for f in Flight.query.all() if f.co2_emitted)
    num_flights = Flight.query.count()
    avg_co2 = total_co2 / num_flights if num_flights > 0 else 0
    aircraft_utilization = {
        a.tail_number: {'hours_flown': a.hours_flown, 'total_flights': a.total_flights}
        for a in Aircraft.query.all()
    }
    crew_utilization = {
        c.crew_id: {'duty_hours': c.duty_hours, 'total_flights': c.total_flights}
        for c in Crew.query.all()
    }
    return jsonify({
        'total_co2': total_co2,
        'average_co2_per_flight': avg_co2,
        'aircraft_utilization': aircraft_utilization,
        'crew_utilization': crew_utilization
    })

@app.route('/assignments', methods=['GET'])
def get_assignments():
    result = optimize_aircraft_assignments()
    assignments, crew_alerts = assign_crews(result['assignments'])
    result['alerts'].extend(crew_alerts)
    result['assignments'] = assignments
    flights = Flight.query.all()
    for f in flights:
        if f.assigned_tail:
            a = Aircraft.query.get(f.assigned_tail)
            if a:
                flight_hours = (f.arr_time - f.dep_time).total_seconds() / 3600
                a.hours_flown += flight_hours
                a.current_location = f.destination
                a.available_from = f.arr_time + timedelta(hours=1)
                db.session.commit()
    return jsonify(result)

@app.route('/optimize', methods=['POST'])
def optimize():
    result = optimize_aircraft_assignments()
    assignments, crew_alerts = assign_crews(result['assignments'])
    result['alerts'].extend(crew_alerts)
    result['assignments'] = assignments
    return jsonify(result)

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
    app.run(debug=True)