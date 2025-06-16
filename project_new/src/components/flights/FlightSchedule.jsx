import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Calendar, Clock } from 'lucide-react';
import GanttChart from './GanttChart';

const FlightSchedule = () => {
  const [dateRange, setDateRange] = useState('today');
  const [viewMode, setViewMode] = useState('gantt');
  const [filterOpen, setFilterOpen] = useState(false);

  // Mock filter options
  const airports = [
    { code: 'JFK', name: 'John F. Kennedy International' },
    { code: 'LAX', name: 'Los Angeles International' },
    { code: 'ORD', name: 'O\'Hare International' },
    { code: 'DFW', name: 'Dallas/Fort Worth International' },
    { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International' },
  ];

  const aircraftTypes = [
    { id: 'b737', name: 'Boeing 737' },
    { id: 'b787', name: 'Boeing 787' },
    { id: 'a320', name: 'Airbus A320' },
    { id: 'a330', name: 'Airbus A330' },
    { id: 'e190', name: 'Embraer E190' },
  ];

  return (
    <div className="pt-16 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <header className="py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Flight Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage flight assignments</p>
        </header>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="flex items-center min-w-0 w-full sm:w-auto">
                <div className="relative rounded-md w-full sm:w-64">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Search flights..."
                  />
                </div>
                
                <div className="ml-3 relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Filter size={16} className="mr-1.5" />
                    Filters
                    <ChevronDown size={14} className="ml-1.5" />
                  </button>
                  
                  {filterOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1 p-3" role="menu" aria-orientation="vertical">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Origin Airport</h4>
                        <div className="space-y-2 mb-4">
                          {airports.slice(0, 3).map(airport => (
                            <label key={airport.code} className="flex items-center">
                              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                              <span className="ml-2 text-sm text-gray-700">{airport.code} - {airport.name}</span>
                            </label>
                          ))}
                        </div>
                        
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Destination Airport</h4>
                        <div className="space-y-2 mb-4">
                          {airports.slice(0, 3).map(airport => (
                            <label key={airport.code} className="flex items-center">
                              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                              <span className="ml-2 text-sm text-gray-700">{airport.code} - {airport.name}</span>
                            </label>
                          ))}
                        </div>
                        
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Aircraft Type</h4>
                        <div className="space-y-2">
                          {aircraftTypes.slice(0, 3).map(type => (
                            <label key={type.id} className="flex items-center">
                              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                              <span className="ml-2 text-sm text-gray-700">{type.name}</span>
                            </label>
                          ))}
                        </div>
                        
                        <div className="pt-4 flex justify-between border-t border-gray-100 mt-4">
                          <button className="text-sm text-gray-600 hover:text-gray-900">
                            Clear All
                          </button>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* View controls */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="flex items-center bg-gray-100 rounded-md p-1">
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      viewMode === 'gantt' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setViewMode('gantt')}
                  >
                    <Calendar size={16} className="inline mr-1.5" />
                    Gantt
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setViewMode('list')}
                  >
                    <Clock size={16} className="inline mr-1.5" />
                    List
                  </button>
                </div>
                
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This Week</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {viewMode === 'gantt' ? (
              <div className="h-[600px] overflow-auto">
                <GanttChart />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aircraft</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crew</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(10)].map((_, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AA{1000 + i}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {airports[i % 5].code} → {airports[(i + 2) % 5].code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(2025, 0, 1, 8 + i % 12, i * 10 % 60).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(2025, 0, 1, 10 + i % 12, (i * 10 + 30) % 60).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {aircraftTypes[i % 5].name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {i % 3 === 0 ? <span className="text-red-500">Unassigned</span> : `Crew ${i + 1}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {i % 5 === 0 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Delayed
                            </span>
                          ) : i % 7 === 0 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Boarding
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              On Time
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSchedule;