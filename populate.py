from app import app, db, Aircraft, Crew, Flight
from datetime import datetime, timedelta
import random

# Define constants
cities = ['Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']
subtypes = ['Boeing 737', 'Airbus A320', 'Boeing 787', 'Airbus A350', 'Boeing 777']

# Generate aircraft data (40 aircraft)
aircraft_data = []
for i in range(1, 41):
    tail_number = f'T{i:02d}'
    subtype = random.choice(subtypes)
    capacity = random.randint(150, 350)
    fuel_efficiency = round(random.uniform(4.5, 6.5), 1)
    current_location = random.choice(cities)
    available_from = datetime.now()
    aircraft_data.append({
        'tail_number': tail_number,
        'subtype': subtype,
        'capacity': capacity,
        'fuel_efficiency': fuel_efficiency,
        'current_location': current_location,
        'available_from': available_from
    })

# Generate crew data (60 crews)
crew_data = []
for i in range(1, 61):
    crew_id = f'C{i:02d}'
    qualifications = ','.join(random.sample(subtypes, random.randint(1, 3)))
    current_location = random.choice(cities)
    available_from = datetime.now()
    crew_data.append({
        'crew_id': crew_id,
        'qualifications': qualifications,
        'current_location': current_location,
        'available_from': available_from,
        'duty_hours': 0.0,
        'total_flights': 0
    })

# Generate flight data (100 flights)
flight_data = []
base_time = datetime.now()
for i in range(1, 101):
    flight_id = f'F{i:03d}'
    origin, destination = random.sample(cities, 2)
    route = f'{origin}-{destination}'
    distance = random.randint(300, 2500)
    dep_time = base_time + timedelta(hours=1.5 * i)  # Spaced 1.5 hours apart
    flight_duration = distance / 500  # hours, assuming 500 km/h speed
    arr_time = dep_time + timedelta(hours=flight_duration)
    required_subtype = random.choice(subtypes)
    passengers = random.randint(100, min(350, random.randint(150, 400)))  # Up to aircraft capacity
    flight_data.append({
        'flight_id': flight_id,
        'route': route,
        'origin': origin,
        'destination': destination,
        'distance': distance,
        'dep_time': dep_time,
        'arr_time': arr_time,
        'required_subtype': required_subtype,
        'passengers': passengers,
        'assigned_tail': None,  # Initially unassigned
        'assigned_crew': None,  # Initially unassigned
        'co2_emitted': 0.0      # Calculated later
    })

def populate_db():
    try:
        # Reset the database
        db.drop_all()
        db.create_all()

        # Add aircraft
        for data in aircraft_data:
            aircraft = Aircraft(**data)
            db.session.add(aircraft)

        # Add crews
        for data in crew_data:
            crew = Crew(**data)
            db.session.add(crew)

        # Add flights
        for data in flight_data:
            flight = Flight(**data)
            db.session.add(flight)

        # Commit all changes
        db.session.commit()
        print(f"Database populated with {len(aircraft_data)} aircraft, {len(crew_data)} crews, and {len(flight_data)} flights.")
    except Exception as e:
        db.session.rollback()
        print(f"Error populating database: {e}")

if __name__ == '__main__':
    with app.app_context():
        populate_db()