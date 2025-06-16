import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Download, BarChart2, RefreshCw } from 'lucide-react';

const OptimizationResults = ({ dateFrom, dateTo, onNewOptimization }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock optimization results
  const results = {
    status: 'completed',
    completedAt: new Date().toISOString(),
    stats: {
      totalFlights: 128,
      unassignedBefore: 32,
      unassignedAfter: 2,
      optimizationScore: 94,
      costReduction: 8.2,
      fuelSavings: 5.5,
      crewUtilization: 12.3
    },
    changes: [
      { id: 1, flight: 'AA123', before: { aircraft: 'N12345', crew: 'Crew 1' }, after: { aircraft: 'N54321', crew: 'Crew 3' } },
      { id: 2, flight: 'AA456', before: { aircraft: null, crew: null }, after: { aircraft: 'N98765', crew: 'Crew 5' } },
      { id: 3, flight: 'AA789', before: { aircraft: 'N45678', crew: 'Crew 2' }, after: { aircraft: 'N45678', crew: 'Crew 2' } },
      { id: 4, flight: 'AA234', before: { aircraft: null, crew: null }, after: { aircraft: 'N87654', crew: 'Crew 1' } },
      { id: 5, flight: 'AA567', before: { aircraft: 'N23456', crew: 'Crew 4' }, after: { aircraft: 'N12345', crew: 'Crew 4' } },
    ],
    conflicts: [
      { id: 1, flight: 'AA890', reason: 'No compatible aircraft available', severity: 'high' },
      { id: 2, flight: 'AA901', reason: 'Crew rest period violation', severity: 'medium' },
    ]
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-green-50 p-6 border-b border-green-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle size={24} className="text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800">Optimization Complete</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>The optimization process completed successfully. We've optimized {results.stats.totalFlights} flights between {new Date(dateFrom).toLocaleDateString()} and {new Date(dateTo).toLocaleDateString()}.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'changes', label: 'Changes' },
            { key: 'conflicts', label: 'Conflicts' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.key === 'conflicts' && results.conflicts.length > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-red-100 text-red-800">
                  {results.conflicts.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <BarChart2 size={24} className="text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Optimization Score</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{results.stats.optimizationScore}/100</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-blue-700">Excellent</span>
                    <span className="text-gray-500"> optimization achieved</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Cost Reduction</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{results.stats.costReduction}%</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-green-700">Estimated savings</span>
                    <span className="text-gray-500"> vs. previous assignments</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                      <AlertCircle size={24} className="text-amber-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Unassigned Flights</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{results.stats.unassignedAfter} <span className="text-sm text-green-600">(-{results.stats.unassignedBefore - results.stats.unassignedAfter})</span></div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-amber-700">Reduced from {results.stats.unassignedBefore}</span>
                    <span className="text-gray-500"> unassigned flights</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Improvement Details</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Fuel Savings</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">{results.stats.fuelSavings}%</dd>
                      <dd className="mt-1 text-sm text-gray-500">More efficient aircraft assignments</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Crew Utilization</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">+{results.stats.crewUtilization}%</dd>
                      <dd className="mt-1 text-sm text-gray-500">Improved crew assignment efficiency</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Aircraft Rotation</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">Optimized</dd>
                      <dd className="mt-1 text-sm text-gray-500">Better fleet utilization</dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={onNewOptimization}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw size={16} className="mr-1.5" />
                New Optimization
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download size={16} className="mr-1.5" />
                Export Results
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'changes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Assignment Changes</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                <Download size={16} className="mr-1.5" />
                Export Changes
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Aircraft</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Aircraft</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Crew</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Crew</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.changes.map((change) => (
                    <tr key={change.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{change.flight}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {change.before.aircraft || <span className="text-red-500">Unassigned</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {change.after.aircraft || <span className="text-red-500">Unassigned</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {change.before.crew || <span className="text-red-500">Unassigned</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {change.after.crew || <span className="text-red-500">Unassigned</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'conflicts' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Unresolved Conflicts</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                {results.conflicts.length} issues
              </span>
            </div>
            
            {results.conflicts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Conflicts</h3>
                <p className="text-gray-500">All flights have been successfully assigned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.conflicts.map((conflict) => (
                  <div 
                    key={conflict.id} 
                    className={`border rounded-md overflow-hidden ${
                      conflict.severity === 'high' ? 'border-red-300' : 'border-amber-300'
                    }`}
                  >
                    <div className={`px-4 py-2 ${
                      conflict.severity === 'high' ? 'bg-red-50' : 'bg-amber-50'
                    }`}>
                      <div className="flex items-center">
                        <AlertCircle 
                          size={20} 
                          className={conflict.severity === 'high' ? 'text-red-500' : 'text-amber-500'} 
                        />
                        <h4 className={`ml-2 text-sm font-medium ${
                          conflict.severity === 'high' ? 'text-red-800' : 'text-amber-800'
                        }`}>
                          {conflict.flight}: {conflict.reason}
                        </h4>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white">
                      <p className="text-sm text-gray-500">
                        {conflict.severity === 'high' 
                          ? 'This conflict requires immediate attention and manual resolution.'
                          : 'Consider manual adjustment to resolve this conflict.'}
                      </p>
                      <div className="mt-2 flex justify-end">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Resolve Manually
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizationResults;