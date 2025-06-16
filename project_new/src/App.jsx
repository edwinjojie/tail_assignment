import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import FlightSchedule from './components/flights/FlightSchedule';
import AircraftList from './components/aircraft/AircraftList';
import CrewList from './components/crew/CrewList';
import Optimization from './components/optimization/Optimization';
import Reports from './components/reports/Reports';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<FlightSchedule />} />
          <Route path="/aircraft" element={<AircraftList />} />
          <Route path="/crew" element={<CrewList />} />
          <Route path="/optimization" element={<Optimization />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;