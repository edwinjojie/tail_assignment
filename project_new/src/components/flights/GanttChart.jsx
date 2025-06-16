import React from 'react';

const GanttChart = () => {
  // Generate mock flight data
  const generateFlights = () => {
    const flights = [];
    const airports = ['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'SFO', 'MIA', 'DEN', 'SEA', 'LAS'];
    const aircraftTypes = ['B737', 'B787', 'A320', 'A330', 'E190'];
    const statuses = ['on-time', 'delayed', 'boarding', 'in-flight', 'arrived', 'unassigned'];
    
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM
    
    for (let i = 0; i < 25; i++) {
      const origin = airports[Math.floor(Math.random() * airports.length)];
      let destination;
      do {
        destination = airports[Math.floor(Math.random() * airports.length)];
      } while (destination === origin);
      
      const departureHour = startHour + Math.floor(Math.random() * (endHour - startHour - 2));
      const departureMinute = Math.floor(Math.random() * 12) * 5;
      const flightDuration = 1 + Math.floor(Math.random() * 5); // 1-5 hours
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const aircraftType = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];

      flights.push({
        id: `FL${1000 + i}`,
        origin,
        destination,
        departureHour,
        departureMinute,
        duration: flightDuration,
        aircraft: i % 5 === 0 ? null : `N${10000 + i} (${aircraftType})`,
        crew: i % 4 === 0 ? null : `Crew ${i % 10 + 1}`,
        status
      });
    }
    
    return flights.sort((a, b) => {
      return a.departureHour * 60 + a.departureMinute - (b.departureHour * 60 + b.departureMinute);
    });
  };
  
  const flights = generateFlights();
  
  // Generate time slots for the Gantt chart
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(hour);
  }
  
  // Get the status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return 'bg-green-500';
      case 'delayed': return 'bg-red-500';
      case 'boarding': return 'bg-amber-500';
      case 'in-flight': return 'bg-blue-500';
      case 'arrived': return 'bg-green-700';
      case 'unassigned': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };
  
  // Get the status text
  const getStatusText = (status) => {
    switch (status) {
      case 'on-time': return 'On Time';
      case 'delayed': return 'Delayed';
      case 'boarding': return 'Boarding';
      case 'in-flight': return 'In Flight';
      case 'arrived': return 'Arrived';
      case 'unassigned': return 'Unassigned';
      default: return status;
    }
  };

  return (
    <div className="relative">
      {/* Time header */}
      <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="w-40 flex-shrink-0 bg-white p-2 border-r border-gray-200">
          <span className="text-xs font-medium text-gray-500">Flight / Time</span>
        </div>
        <div className="flex-1 flex">
          {timeSlots.map((hour) => (
            <div 
              key={hour} 
              className="w-20 flex-shrink-0 p-2 text-center border-r border-gray-200"
            >
              <span className="text-xs font-medium text-gray-500">
                {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'AM' : 'PM'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Flight rows */}
      <div>
        {flights.map((flight) => (
          <div key={flight.id} className="flex border-b border-gray-100 hover:bg-blue-50 group">
            <div className="w-40 flex-shrink-0 p-2 border-r border-gray-200">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{flight.id}</span>
                <span className="text-xs text-gray-500">{flight.origin} → {flight.destination}</span>
              </div>
            </div>
            <div className="flex-1 flex relative">
              {timeSlots.map((hour) => (
                <div 
                  key={hour} 
                  className="w-20 flex-shrink-0 border-r border-gray-200 relative"
                >
                  {/* 5-minute interval markers */}
                  <div className="h-full flex">
                    {[0, 1, 2, 3].map((interval) => (
                      <div 
                        key={interval} 
                        className="w-1/4 h-full border-r border-gray-100 last:border-0"
                      />
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Flight bar */}
              <div 
                className={`absolute top-1 h-6 rounded-md ${getStatusColor(flight.status)} group-hover:shadow-md transition-shadow`}
                style={{
                  left: `${((flight.departureHour - 6) * 60 + flight.departureMinute) / (16 * 60) * 100}%`,
                  width: `${(flight.duration * 60) / (16 * 60) * 100}%`,
                }}
              >
                <div className="h-full flex items-center justify-between px-2 overflow-hidden">
                  <div className="text-xs font-medium text-white truncate">
                    {flight.origin} → {flight.destination}
                  </div>
                  <div className="text-xs text-white font-medium ml-1 whitespace-nowrap">
                    {`${flight.departureHour % 12 || 12}:${flight.departureMinute.toString().padStart(2, '0')}${flight.departureHour < 12 ? 'a' : 'p'}`}
                  </div>
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute hidden group-hover:block left-0 bottom-full mb-2 bg-white shadow-lg rounded-md p-3 w-56 z-30">
                  <div className="text-sm font-semibold text-gray-800 mb-1">{flight.id}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-gray-500">Route:</div>
                    <div className="font-medium text-gray-800">{flight.origin} → {flight.destination}</div>
                    
                    <div className="text-gray-500">Departure:</div>
                    <div className="font-medium text-gray-800">
                      {`${flight.departureHour % 12 || 12}:${flight.departureMinute.toString().padStart(2, '0')} ${flight.departureHour < 12 ? 'AM' : 'PM'}`}
                    </div>
                    
                    <div className="text-gray-500">Duration:</div>
                    <div className="font-medium text-gray-800">{flight.duration}h</div>
                    
                    <div className="text-gray-500">Aircraft:</div>
                    <div className="font-medium text-gray-800">{flight.aircraft || 'Unassigned'}</div>
                    
                    <div className="text-gray-500">Crew:</div>
                    <div className="font-medium text-gray-800">{flight.crew || 'Unassigned'}</div>
                    
                    <div className="text-gray-500">Status:</div>
                    <div className="font-medium">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(flight.status).replace('bg-', 'text-')}`}>
                        {getStatusText(flight.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;