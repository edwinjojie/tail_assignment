import React, { useState } from 'react';
import { Search, Filter, Plus, Plane } from 'lucide-react';

const AircraftList = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock aircraft data
  const aircraftData = [
    { id: 'N12345', type: 'Boeing 737-800', capacity: 189, location: 'JFK', status: 'available', nextMaintenance: '25 days' },
    { id: 'N54321', type: 'Airbus A320', capacity: 150, location: 'LAX', status: 'in-flight', nextMaintenance: '12 days' },
    { id: 'N98765', type: 'Boeing 787-9', capacity: 290, location: 'DFW', status: 'maintenance', nextMaintenance: 'In progress' },
    { id: 'N45678', type: 'Embraer E190', capacity: 100, location: 'ORD', status: 'available', nextMaintenance: '8 days' },
    { id: 'N87654', type: 'Airbus A330-300', capacity: 440, location: 'ATL', status: 'in-flight', nextMaintenance: '30 days' },
    { id: 'N23456', type: 'Boeing 737-900', capacity: 220, location: 'SFO', status: 'available', nextMaintenance: '15 days' },
    { id: 'N76543', type: 'Airbus A321', capacity: 220, location: 'MIA', status: 'maintenance', nextMaintenance: 'In progress' },
    { id: 'N34567', type: 'Boeing 777-300ER', capacity: 550, location: 'DEN', status: 'in-flight', nextMaintenance: '20 days' },
  ];
  
  // Filter aircraft based on status and search term
  const filteredAircraft = aircraftData.filter(aircraft => {
    const matchesStatus = selectedStatus === 'all' || aircraft.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      aircraft.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  // Status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-flight':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate status counts
  const statusCounts = {
    all: aircraftData.length,
    available: aircraftData.filter(a => a.status === 'available').length,
    'in-flight': aircraftData.filter(a => a.status === 'in-flight').length,
    maintenance: aircraftData.filter(a => a.status === 'maintenance').length,
  };

  return (
    <div className="pt-16 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <header className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Aircraft Fleet</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and monitor your fleet's status and availability</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus size={16} className="mr-1.5" />
              Add Aircraft
            </button>
          </div>
        </header>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Status tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {[
                { key: 'all', label: 'All Aircraft' },
                { key: 'available', label: 'Available' },
                { key: 'in-flight', label: 'In Flight' },
                { key: 'maintenance', label: 'Maintenance' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    selectedStatus === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    selectedStatus === tab.key ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {statusCounts[tab.key]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Search and filter */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="relative rounded-md shadow-sm flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Search aircraft by ID, type or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="ml-3">
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Filter size={16} className="mr-1.5" />
                  More Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Aircraft table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aircraft</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Maintenance</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAircraft.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No aircraft found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredAircraft.map((aircraft) => (
                    <tr key={aircraft.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Plane size={20} className="text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{aircraft.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aircraft.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aircraft.capacity} seats</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aircraft.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(aircraft.status)}`}>
                          {aircraft.status.charAt(0).toUpperCase() + aircraft.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aircraft.nextMaintenance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:text-blue-900">Details</a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAircraft.length}</span> of{' '}
                  <span className="font-medium">{filteredAircraft.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftList;