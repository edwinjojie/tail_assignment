import React, { useState } from 'react';
import { Play, Sliders, Clock, FileCheck, Clipboard, ArrowRight } from 'lucide-react';
import OptimizationResults from './OptimizationResults';

const Optimization = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [optimizationParams, setOptimizationParams] = useState({
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    goals: {
      minimizeCost: true,
      minimizeEmissions: false,
      maximizeCrewEfficiency: true,
      minimizeAircraftChanges: false
    },
    constraints: {
      maintenance: true,
      crewRest: true,
      connectionTime: true,
      preferredAircraft: false
    }
  });
  
  const [showResults, setShowResults] = useState(false);
  
  const handleOptimizationChange = (event) => {
    const { name, checked, value, type } = event.target;
    
    if (name.includes('.')) {
      const [category, param] = name.split('.');
      setOptimizationParams({
        ...optimizationParams,
        [category]: {
          ...optimizationParams[category],
          [param]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setOptimizationParams({
        ...optimizationParams,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleOptimize = () => {
    // In a real app, this would make an API call
    // For demo purposes, we'll just show the results
    setShowResults(true);
  };
  
  const steps = [
    { number: 1, title: 'Set Parameters', icon: <Sliders size={20} /> },
    { number: 2, title: 'Review', icon: <Clipboard size={20} /> },
    { number: 3, title: 'Optimize', icon: <Play size={20} /> },
    { number: 4, title: 'Results', icon: <FileCheck size={20} /> }
  ];

  return (
    <div className="pt-16 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <header className="py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Tail Assignment Optimization</h1>
          <p className="mt-1 text-sm text-gray-500">Optimize your fleet and crew assignments for maximum efficiency</p>
        </header>
        
        {!showResults ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Steps indicator */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                {steps.map((step, idx) => (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center">
                      <div 
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          activeStep >= step.number 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div className="text-xs mt-1 font-medium text-gray-600">{step.title}</div>
                    </div>
                    
                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-px mx-2 ${activeStep > step.number ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              {activeStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Optimization Period</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="dateFrom"
                          id="dateFrom"
                          value={optimizationParams.dateFrom}
                          onChange={handleOptimizationChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="dateTo"
                          id="dateTo"
                          value={optimizationParams.dateTo}
                          onChange={handleOptimizationChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Optimization Goals</h3>
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <p className="text-sm text-blue-800">Prioritize the goals that matter most for your airline operations</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            name="goals.minimizeCost"
                            checked={optimizationParams.goals.minimizeCost}
                            onChange={handleOptimizationChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Minimize Operational Costs</span>
                            <p className="text-xs text-gray-500">Reduce fuel consumption, maintenance, and crew costs</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            name="goals.minimizeEmissions"
                            checked={optimizationParams.goals.minimizeEmissions}
                            onChange={handleOptimizationChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Minimize Emissions</span>
                            <p className="text-xs text-gray-500">Reduce carbon footprint by optimizing aircraft usage</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            name="goals.maximizeCrewEfficiency"
                            checked={optimizationParams.goals.maximizeCrewEfficiency}
                            onChange={handleOptimizationChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Maximize Crew Efficiency</span>
                            <p className="text-xs text-gray-500">Optimize crew assignments to minimize downtime</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            name="goals.minimizeAircraftChanges"
                            checked={optimizationParams.goals.minimizeAircraftChanges}
                            onChange={handleOptimizationChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Minimize Aircraft Changes</span>
                            <p className="text-xs text-gray-500">Reduce equipment swaps to improve operational stability</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Constraints</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            name="constraints.maintenance"
                            checked={optimizationParams.constraints.maintenance}
                            onChange={handleOptimizationChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Respect Maintenance Windows</span>
                            <p className="text-xs text-gray-500">Account for scheduled maintenance periods</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            name="constraints.crewRest"
                            checked={optimizationParams.constraints.crewRest}
                            onChange={handleOptimizationChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Enforce Crew Rest Periods</span>
                            <p className="text-xs text-gray-500">Ensure all crew members get required rest between flights</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            name="constraints.connectionTime"
                            checked={optimizationParams.constraints.connectionTime}
                            onChange={handleOptimizationChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Minimum Connection Times</span>
                            <p className="text-xs text-gray-500">Ensure sufficient time for aircraft and crew connections</p>
                          </div>
                        </label>
                      </div>
                      
                      <div className="bg-white p-4 border border-gray-200 rounded-md">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            name="constraints.preferredAircraft"
                            checked={optimizationParams.constraints.preferredAircraft}
                            onChange={handleOptimizationChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">Preferred Aircraft Assignments</span>
                            <p className="text-xs text-gray-500">Respect preferred aircraft types for specific routes</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Optimization Summary</h3>
                    <p className="text-sm text-blue-800">Review your optimization settings before proceeding</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900">Time Period</h4>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(optimizationParams.dateFrom).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(optimizationParams.dateTo).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900">Optimization Goals</h4>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {Object.entries(optimizationParams.goals).map(([key, value]) => (
                          value && (
                            <li key={key} className="flex items-center">
                              <ArrowRight size={16} className="text-blue-500 mr-2" />
                              <span className="text-sm text-gray-800">
                                {key === 'minimizeCost' && 'Minimize Operational Costs'}
                                {key === 'minimizeEmissions' && 'Minimize Emissions'}
                                {key === 'maximizeCrewEfficiency' && 'Maximize Crew Efficiency'}
                                {key === 'minimizeAircraftChanges' && 'Minimize Aircraft Changes'}
                              </span>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900">Constraints</h4>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {Object.entries(optimizationParams.constraints).map(([key, value]) => (
                          value && (
                            <li key={key} className="flex items-center">
                              <ArrowRight size={16} className="text-blue-500 mr-2" />
                              <span className="text-sm text-gray-800">
                                {key === 'maintenance' && 'Respect Maintenance Windows'}
                                {key === 'crewRest' && 'Enforce Crew Rest Periods'}
                                {key === 'connectionTime' && 'Minimum Connection Times'}
                                {key === 'preferredAircraft' && 'Preferred Aircraft Assignments'}
                              </span>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep === 3 && (
                <div className="space-y-6 flex flex-col items-center justify-center py-12">
                  <div className="text-center max-w-md">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                      <Play size={30} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Optimize</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      The optimization process will analyze all possible combinations of aircraft and crew assignments to find the most efficient solution based on your parameters.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                      <div className="flex">
                        <Clock size={20} className="text-amber-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          This process may take several minutes depending on the complexity of your schedule and the date range selected.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleOptimize}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Start Optimization
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              )}
              {activeStep < 3 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        ) : (
          <OptimizationResults 
            dateFrom={optimizationParams.dateFrom}
            dateTo={optimizationParams.dateTo}
            onNewOptimization={() => setShowResults(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Optimization;