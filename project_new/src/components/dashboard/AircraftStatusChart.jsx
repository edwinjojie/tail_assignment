import React from 'react';

const AircraftStatusChart = () => {
  // In a real app, you would fetch this data from your API
  const aircraftStatus = {
    available: 28,
    inFlight: 8,
    maintenance: 6,
    total: 42
  };
  
  // Calculate percentages
  const availablePercent = (aircraftStatus.available / aircraftStatus.total) * 100;
  const inFlightPercent = (aircraftStatus.inFlight / aircraftStatus.total) * 100;
  const maintenancePercent = (aircraftStatus.maintenance / aircraftStatus.total) * 100;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="h-48 w-full flex items-end justify-around px-8">
          <div className="flex flex-col items-center">
            {/* <div className="text-sm font-medium text-gray-500 mb-1">Available</div> */}
            <div className="w-16 bg-blue-100 rounded-t-lg" style={{ height: `${availablePercent * 1.5}px` }}>
              <div className="h-full w-full bg-blue-500 rounded-t-lg relative">
                <div className="absolute inset-x-0 -top-6 text-center text-blue-700 font-semibold">
                  {aircraftStatus.available}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            {/* <div className="text-sm font-medium text-gray-500 mb-1">In Flight</div> */}
            <div className="w-16 bg-green-100 rounded-t-lg" style={{ height: `${inFlightPercent * 1.5}px` }}>
              <div className="h-full w-full bg-green-500 rounded-t-lg relative">
                <div className="absolute inset-x-0 -top-6 text-center text-green-700 font-semibold">
                  {aircraftStatus.inFlight}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            {/* <div className="text-sm font-medium text-gray-500 mb-1">Maintenance</div> */}
            <div className="w-16 bg-amber-100 rounded-t-lg" style={{ height: `${maintenancePercent * 1.5}px` }}>
              <div className="h-full w-full bg-amber-500 rounded-t-lg relative">
                <div className="absolute inset-x-0 -top-6 text-center text-amber-700 font-semibold">
                  {aircraftStatus.maintenance}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="flex items-center justify-center">
          <span className="inline-block h-3 w-3 bg-blue-500 rounded-full mr-1"></span>
          <span className="text-xs text-gray-500">
              {availablePercent.toFixed(0)}% Available
          </span>
        </div>
        <div className="flex items-center justify-center">
          <span className="inline-block h-3 w-3 bg-green-500 rounded-full mr-1"></span>
          <span className="text-xs text-gray-500">
              {inFlightPercent.toFixed(0)}% In Flight
          </span>
        </div>
        <div className="flex items-center justify-center">
          <span className="inline-block h-3 w-3 bg-amber-500 rounded-full mr-1"></span>
          <span className="text-xs text-gray-500">
              {maintenancePercent.toFixed(0)}% Maintenance
          </span>
        </div>
      </div>
    </div>
  );
};

export default AircraftStatusChart;