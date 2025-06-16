import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Box, Card, CardContent, Typography, Grid, Paper } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const [stats, setStats] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, flightsResponse] = await Promise.all([
          fetch('http://localhost:5000/statistics'),
          fetch('http://localhost:5000/flights')
        ]);

        if (!statsResponse.ok) throw new Error('Failed to fetch statistics');
        if (!flightsResponse.ok) throw new Error('Failed to fetch flights');

        const [statsData, flightsData] = await Promise.all([
          statsResponse.json(),
          flightsResponse.json()
        ]);

        setStats(statsData);
        setFlights(flightsData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats || !flights) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading statistics...</Typography>
      </Box>
    );
  }

  const co2Data = {
    labels: [...new Set(flights.map(f => f.dep_time.split('T')[0]))].sort(),
    datasets: [{
      label: 'CO2 Emissions (kg)',
      data: [...new Set(flights.map(f => f.dep_time.split('T')[0]))].sort().map(date =>
        flights.filter(f => f.dep_time.split('T')[0] === date)
          .reduce((sum, f) => sum + (f.co2_emitted || 0), 0)
      ),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  const flightDistData = {
    labels: Object.keys(stats.aircraft_utilization),
    datasets: [{
      label: 'Flights per Aircraft',
      data: Object.values(stats.aircraft_utilization).map(a => a.total_flights),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ]
    }]
  };

  const crewData = {
    labels: Object.keys(stats.crew_utilization),
    datasets: [{
      label: 'Duty Hours',
      data: Object.values(stats.crew_utilization).map(c => c.duty_hours),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Statistics Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Total CO2 Emissions</Typography>
            <Typography variant="h4" color="primary">
              {stats.total_co2.toLocaleString()} kg
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Average CO2 per Flight</Typography>
            <Typography variant="h4" color="primary">
              {stats.average_co2_per_flight.toLocaleString()} kg
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Total Flights</Typography>
            <Typography variant="h4" color="primary">
              {flights.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>CO2 Emissions Over Time</Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={co2Data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'CO2 Emissions (kg)'
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Flight Distribution by Aircraft</Typography>
            <Box sx={{ height: 300 }}>
              <Pie 
                data={flightDistData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Crew Utilization</Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={crewData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Duty Hours'
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Statistics;