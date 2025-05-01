import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Plane, Calendar, AlertTriangle, Moon, Sun, BarChart, Users } from 'lucide-react';
import AlertsPanel from './components/AlertsPanel';
import AircraftPage from './components/AircraftPage';
import Statistics from './components/Statistics';
import CrewPage from './components/CrewPage';
import FlightPage from './components/FlightPage';
import { fetchAssignments, fetchAircraft, fetchFlights, fetchCrews } from './services/api';
import getTheme from './theme';

function App() {
  const [assignments, setAssignments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [unassignedFlights, setUnassignedFlights] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [flights, setFlights] = useState([]);
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('light');

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const assignmentsData = await fetchAssignments();
      if (assignmentsData) {
        setAssignments(assignmentsData.assignments || []);
        setAlerts(assignmentsData.alerts || []);
        setUnassignedFlights(assignmentsData.unassigned_flights || []);
      }

      const aircraftData = await fetchAircraft();
      if (aircraftData) setAircraft(aircraftData);

      const flightsData = await fetchFlights();
      if (flightsData) setFlights(flightsData);

      const crewsData = await fetchCrews();
      if (crewsData) setCrews(crewsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          transition: 'background-color 0.3s ease'
        }}>
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              backdropFilter: 'blur(8px)',
              backgroundColor: mode === 'dark'
                ? 'rgba(30, 30, 30, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <Toolbar>
              <Plane size={32} style={{ marginRight: '12px' }} />
              <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
                Tail Assignment System
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Link to="/flights" style={{ textDecoration: 'none' }}>
                  <Button
                    startIcon={<Calendar size={20} />}
                    sx={{ color: 'text.primary' }}
                  >
                    Schedule
                  </Button>
                </Link>
                <Link to="/aircraft" style={{ textDecoration: 'none' }}>
                  <Button
                    startIcon={<Plane size={20} />}
                    sx={{ color: 'text.primary' }}
                  >
                    Aircraft
                  </Button>
                </Link>
                <Link to="/crews" style={{ textDecoration: 'none' }}>
                  <Button
                    startIcon={<Users size={20} />}
                    sx={{ color: 'text.primary' }}
                  >
                    Crews
                  </Button>
                </Link>
                <Link to="/statistics" style={{ textDecoration: 'none' }}>
                  <Button
                    startIcon={<BarChart size={20} />}
                    sx={{ color: 'text.primary' }}
                  >
                    Statistics
                  </Button>
                </Link>
                <Link to="/alerts" style={{ textDecoration: 'none' }}>
                  <Button
                    startIcon={<AlertTriangle size={20} />}
                    sx={{
                      color: alerts.length > 0 ? 'error.main' : 'text.primary'
                    }}
                  >
                    Alerts {alerts.length > 0 && `(${alerts.length})`}
                  </Button>
                </Link>
                <IconButton
                  onClick={toggleColorMode}
                  sx={{ color: 'text.primary' }}
                >
                  {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          <Container maxWidth="xl" sx={{ flexGrow: 1, py: 2 }}>
            <Routes>
              <Route
                path="/flights"
                element={
                  <FlightPage
                    refreshData={loadData}
                    assignments={assignments}
                    unassignedFlights={unassignedFlights}
                    loading={loading}
                  />
                }
              />
              <Route
                path="/flights/:flight_id"
                element={
                  <FlightPage
                    refreshData={loadData}
                    assignments={assignments}
                    unassignedFlights={unassignedFlights}
                    loading={loading}
                  />
                }
              />
              <Route
                path="/aircraft"
                element={
                  <AircraftPage
                    aircraft={aircraft}
                    loading={loading}
                    refreshData={loadData}
                  />
                }
              />
              <Route
                path="/aircraft/:tail_number"
                element={
                  <AircraftPage
                    aircraft={aircraft}
                    loading={loading}
                    refreshData={loadData}
                  />
                }
              />
              <Route
                path="/crews"
                element={
                  <CrewPage
                    crews={crews}
                    loading={loading}
                    refreshData={loadData}
                  />
                }
              />
              <Route
                path="/statistics"
                element={<Statistics mode={mode} />}
              />
              <Route
                path="/alerts"
                element={<AlertsPanel alerts={alerts} />}
              />
              <Route
                path="/"
                element={<FlightPage
                  refreshData={loadData}
                  assignments={assignments}
                  unassignedFlights={unassignedFlights}
                  loading={loading}
                />}
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;