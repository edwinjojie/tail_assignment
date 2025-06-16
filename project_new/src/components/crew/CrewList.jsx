import React, { useState } from 'react';
import { Search, Filter, Plus, User, Users, Shield, Clock } from 'lucide-react';

const CrewList = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock crew data
  const crewData = [
    { id: 1, name: 'Captain John Smith', qualifications: ['B737', 'B787'], dutyHours: 52, restUntil: null, status: 'available', role: 'Captain' },
    { id: 2, name: 'First Officer Maria Garcia', qualifications: ['A320', 'A330'], dutyHours: 65, restUntil: null, status: 'available', role: 'First Officer' },
    { id: 3, name: 'Flight Attendant Robert Johnson', qualifications: ['All Aircraft'], dutyHours: 70, restUntil: '2025-01-15T14:00:00Z', status: 'resting', role: 'Flight Attendant' },
    { id: 4, name: 'Captain Sarah Williams', qualifications: ['B737', 'A320'], dutyHours: 34, restUntil: null, status: 'available', role: 'Captain' },
    { id: 5, name: 'First Officer Michael Brown', qualifications: ['B787', 'B777'], dutyHours: 75, restUntil: '2025-01-14T08:00:00Z', status: 'resting', role: 'First Officer' },
    { id: 6, name: 'Flight Attendant Emily Davis', qualifications: ['All Aircraft'], dutyHours: 48, restUntil: null, status: 'available', role: 'Flight Attendant' },
    { id: 7, name: 'Captain David Martinez', qualifications: ['A330', 'A350'], dutyHours: 28, restUntil: null, status: 'available', role: 'Captain' },
    { id: 8, name: 'First Officer Lisa Wilson', qualifications: ['B737', 'A320'], dutyHours: 61, restUntil: null, status: 'available', role: 'First Officer' },
  ];
  
  // Filter crew based on tab and search term
  const filteredCrew = crewData.filter(crew => {
    const matchesTab = selectedTab === 'all' || crew.status === selectedTab || crew.role.toLowerCase() === selectedTab;
    const matchesSearch = searchTerm === '' || 
      crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crew.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase())) ||
      crew.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'resting':
        return 'bg-blue-100 text-blue-800';
      case 'duty':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate counts for tabs
  const counts = {
    all: crewData.length,
    available: crewData.filter(c => c.status === 'available').length,
    resting: crewData.filter(c => c.status === 'resting').length,
    captain: crewData.filter(c => c.role === 'Captain').length,
    'first officer': crewData.filter(c => c.role === 'First Officer').length,
    'flight attendant': crewData.filter(c => c.role === 'Flight Attendant').length,
  };
  
  // Format rest time
  const formatRestTime = (isoString) => {
    if (!isoString) return 'N/A';
    
    const date = new Date(isoString);
    const now = new Date();
    
    // Calculate hours difference
    const diffMs = date - now;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours <= 0) return 'Ready';
    if (diffHours < 24) return `${diffHours}h remaining`;
    
    // Format as date if more than 24 hours
    return `Until ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="pt-16 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <header className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Crew Management</h1>
            <p className="mt-1 text-sm text-gray-500">Monitor crew availability and qualifications</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus size={16} className="mr-1.5" />
              Add Crew Member
            </button>
          </div>
        </header>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Status tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {[
                { key: 'all', label: 'All Crew', icon: <Users size={16} /> },
                { key: 'available', label: 'Available', icon: <User size={16} /> },
                { key: 'resting', label: 'Resting', icon: <Clock size={16} /> },
                { key: 'captain', label: 'Captains', icon: <Shield size={16} /> },
                { key: 'first officer', label: 'First Officers', icon: <Shield size={16} /> },
                { key: 'flight attendant', label: 'Flight Attendants', icon: <User size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                    selectedTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    selectedTab === tab.key ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {counts[tab.key]}
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
                  placeholder="Search crew by name, role or qualifications..."
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
          
          {/* Crew table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duty Hours</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rest Until</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCrew.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No crew members found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredCrew.map((crew) => (
                    <tr key={crew.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                            <User size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{crew.name}</div>
                            <div className="text-sm text-gray-500">ID #{crew.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crew.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {crew.qualifications.map((qual, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                              {qual}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  crew.dutyHours < 60 ? 'bg-green-500' : 
                                  crew.dutyHours < 70 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(100, (crew.dutyHours / 80) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">{crew.dutyHours}h</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(crew.status)}`}>
                          {crew.status.charAt(0).toUpperCase() + crew.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatRestTime(crew.restUntil)}
                      </td>
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCrew.length}</span> of{' '}
                  <span className="font-medium">{filteredCrew.length}</span> results
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

export default CrewList;