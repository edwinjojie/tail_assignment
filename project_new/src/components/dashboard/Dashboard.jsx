import React from 'react';
import SummaryCard from './SummaryCard';
import AlertsList from './AlertsList';
import { Plane, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import FlightStatusChart from './FlightStatusChart';
import AircraftStatusChart from './AircraftStatusChart';

const Dashboard = () => {
  // Mock data
  const summaryData = {
    totalFlights: 128,
    assignedFlights: 112,
    unassignedFlights: 16,
    aircraftTotal: 42,
    aircraftAvailable: 28,
    aircraftMaintenance: 6,
    aircraftInFlight: 8,
    crewTotal: 156,
    crewAvailable: 132,
    crewResting: 24,
  };
  
  const alerts = [
    { id: 1, type: 'warning', message: 'Flight AA123 has no aircraft assigned', time: '10 minutes ago' },
    { id: 2, type: 'error', message: 'Crew shortage for 3 upcoming flights', time: '25 minutes ago' },
    { id: 3, type: 'info', message: 'Aircraft B737-800 scheduled for maintenance', time: '2 hours ago' },
    { id: 4, type: 'success', message: 'Optimization complete: 98% efficiency achieved', time: '3 hours ago' },
    { id: 5, type: 'warning', message: 'Aircraft N12345 approaching maintenance limit', time: '4 hours ago' }
  ];

  return (
    <div className="pt-16 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <header className="py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Operational overview for today's flights and resources</p>
        </header>
        
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard 
            title="Total Flights"
            value={summaryData.totalFlights}
            color="blue"
            icon={<Plane size={24} />}
            footer={`${summaryData.assignedFlights} assigned · ${summaryData.unassignedFlights} unassigned`}
          />
          
          <SummaryCard 
            title="Aircraft Status"
            value={summaryData.aircraftTotal}
            color="green"
            icon={<Plane size={24} />}
            footer={`${summaryData.aircraftAvailable} available · ${summaryData.aircraftMaintenance} maintenance`}
          />
          
          <SummaryCard 
            title="Crew Status"
            value={summaryData.crewTotal}
            color="amber"
            icon={<Users size={24} />}
            footer={`${summaryData.crewAvailable} available · ${summaryData.crewResting} resting`}
          />
          
          <SummaryCard 
            title="Alerts"
            value={alerts.length}
            color="red"
            icon={<AlertTriangle size={24} />}
            footer={`${alerts.filter(a => a.type === 'warning' || a.type === 'error').length} require attention`}
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Flight Status</h2>
            </div>
            <div className="p-4 h-80">
              <FlightStatusChart />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Aircraft Status</h2>
            </div>
            <div className="p-4 h-80">
              <AircraftStatusChart />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Alerts</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">View all</button>
            </div>
            <AlertsList alerts={alerts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;