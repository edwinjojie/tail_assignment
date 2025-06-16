import React, { useState } from 'react';
import { BarChart, PieChart, LineChart, Download, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  const [dateRange, setDateRange] = useState('last7days');
  const [reportType, setReportType] = useState('utilization');
  
  // Mock report data
  const reports = [
    { id: 'utilization', name: 'Fleet Utilization', icon: <BarChart size={20} /> },
    { id: 'efficiency', name: 'Crew Efficiency', icon: <LineChart size={20} /> },
    { id: 'costs', name: 'Operational Costs', icon: <PieChart size={20} /> },
    { id: 'delays', name: 'Delays Analysis', icon: <BarChart size={20} /> },
  ];
  
  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'yesterday', name: 'Yesterday' },
    { id: 'last7days', name: 'Last 7 Days' },
    { id: 'thisMonth', name: 'This Month' },
    { id: 'lastMonth', name: 'Last Month' },
    { id: 'custom', name: 'Custom Range' },
  ];

  return (
    <div className="pt-16 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <header className="py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Analyze performance metrics and operational statistics</p>
        </header>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Report type selection */}
          <div className="border-b border-gray-200">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setReportType(report.id)}
                    className={`p-4 rounded-lg border ${
                      reportType === report.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    } flex items-center justify-between transition-colors duration-150`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${
                        reportType === report.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {report.icon}
                      </div>
                      <span className="ml-3 font-medium">{report.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Date range and filters */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="w-full sm:w-auto flex items-center">
                <div className="flex items-center text-gray-500 mr-2">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">Period:</span>
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  {dateRanges.map((range) => (
                    <option key={range.id} value={range.id}>{range.name}</option>
                  ))}
                </select>
                
                {dateRange === 'custom' && (
                  <div className="flex items-center ml-4 space-x-2">
                    <input
                      type="date"
                      className="block rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      className="block rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center w-full sm:w-auto">
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
                  <Filter size={16} className="mr-1.5" />
                  Filters
                </button>
                
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Download size={16} className="mr-1.5" />
                  Export
                </button>
              </div>
            </div>
          </div>
          
          {/* Report content */}
          <div className="p-6">
            {reportType === 'utilization' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fleet Utilization Report</h3>
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-medium text-gray-800">Daily Aircraft Utilization (Hours)</h4>
                    <div className="text-sm text-gray-500">Average: 9.2 hours/day</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 h-72">
                    {/* Utilization chart would go here - using placeholder */}
                    <div className="h-full flex items-center justify-center">
                      <div className="h-48 w-full">
                        <div className="flex items-end justify-between h-full relative">
                          <div className="absolute inset-0 grid grid-cols-1 divide-y divide-gray-200 -z-10">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="w-full" />
                            ))}
                          </div>
                          
                          {/* Fake chart bars */}
                          {[9.2, 8.7, 10.1, 9.5, 8.9, 9.8, 10.5].map((value, index) => (
                            <div key={index} className="w-16 flex flex-col items-center">
                              <div 
                                className="w-12 bg-blue-500 rounded-t-sm" 
                                style={{ height: `${(value / 12) * 100}%` }}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-base font-medium text-gray-800 mb-4">Aircraft Type Performance</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-64">
                      <div className="h-full flex flex-col justify-center">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aircraft Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Hours</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Boeing 737-800</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">10.2</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Airbus A320</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">9.7</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Boeing 787-9</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">11.5</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Embraer E190</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">8.4</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Airbus A330-300</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">10.8</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium text-gray-800 mb-4">Route Analysis</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-64">
                      <div className="h-full flex flex-col justify-center">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Flights</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aircraft Types</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">JFK → LAX</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">6</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">B787, A330</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">ORD → DFW</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">8</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">B737, A320</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">ATL → MIA</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">10</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">B737, A320, E190</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">DFW → LAX</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">5</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">A320, B737</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">SFO → SEA</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">7</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">B737, E190</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {reportType === 'efficiency' && (
              <div className="text-center py-12 text-gray-500">
                <LineChart size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">Crew Efficiency Report</h3>
                <p>Select a time period and parameters to generate this report</p>
              </div>
            )}
            
            {reportType === 'costs' && (
              <div className="text-center py-12 text-gray-500">
                <PieChart size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">Operational Costs Report</h3>
                <p>Select a time period and parameters to generate this report</p>
              </div>
            )}
            
            {reportType === 'delays' && (
              <div className="text-center py-12 text-gray-500">
                <BarChart size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">Delays Analysis Report</h3>
                <p>Select a time period and parameters to generate this report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;