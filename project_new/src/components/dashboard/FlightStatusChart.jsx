import React from 'react';

const FlightStatusChart = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="relative h-60 w-60">
        {/* This is a placeholder for a real chart implementation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-60 w-60">
            {/* Custom donut chart with segments */}
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eaeaea"
                strokeWidth="3"
              />
              {/* On schedule - Green */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray="75, 100"
                strokeDashoffset={-10}
                className="shadow-sm"
              />
              {/* Delayed - Amber */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeDasharray="15, 100"
                strokeDashoffset={0}
                className="shadow-sm"
              />
              {/* Cancelled - Red */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="5, 100"
                strokeDashoffset={-15}
                className="shadow-sm"
              />
              {/* Unassigned - Blue */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="5, 100"
                strokeDashoffset={-20}
                className="shadow-sm"
              />
              {/* <text x="18" y="20.5" className="fill-gray-700 font-semibold text-5px text-center" textAnchor="middle">
                128
              </text>
              <text x="18" y="15.5" className="fill-gray-500 font-medium text-2px text-center" textAnchor="middle" style={{"size":12}}>
                TOTAL FLIGHTS
              </text> */}
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4 w-full">
        <div className="flex items-center">
          <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">On Schedule (96)</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-amber-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Delayed (19)</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Cancelled (7)</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Unassigned (6)</span>
        </div>
      </div>
    </div>
  );
};

export default FlightStatusChart;