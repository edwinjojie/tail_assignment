import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { format } from 'date-fns';

function FlightDetails() {
  const { flight_id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/flights/${flight_id}`);
        if (!response.ok) throw new Error('Flight not found');
        const data = await response.json();
        setFlight(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
    const interval = setInterval(fetchFlight, 30000);
    return () => clearInterval(interval);
  }, [flight_id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!flight) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No data available for this flight.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Flight {flight.flight_id}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Flight Details</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography color="text.secondary">Route</Typography>
                <Typography variant="h6">{flight.route}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography color="text.secondary">Distance</Typography>
                <Typography variant="h6">{flight.distance} km</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography color="text.secondary">Passengers</Typography>
                <Typography variant="h6">{flight.passengers}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography color="text.secondary">CO2 Emitted</Typography>
                <Typography variant="h6">{flight.co2_emitted.toLocaleString()} kg</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography color="text.secondary">Origin</Typography>
                <Typography variant="h6">{flight.origin}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Departure: {format(new Date(flight.dep_time), 'PPp')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography color="text.secondary">Destination</Typography>
                <Typography variant="h6">{flight.destination}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Arrival: {format(new Date(flight.arr_time), 'PPp')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Aircraft</Typography>
            {flight.aircraft_details ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Tail Number</Typography>
                  <Typography variant="h6">
                    <Link 
                      to={`/aircraft/${flight.aircraft_details.tail_number}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {flight.aircraft_details.tail_number}
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Subtype</Typography>
                  <Typography variant="h6">{flight.aircraft_details.subtype}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="text.secondary">Capacity</Typography>
                  <Typography variant="h6">{flight.aircraft_details.capacity} passengers</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Fuel Efficiency</Typography>
                  <Typography variant="h6">{flight.aircraft_details.fuel_efficiency} kg/km</Typography>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="warning">No aircraft assigned</Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Crew</Typography>
            {flight.crew_details ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Crew ID</Typography>
                  <Typography variant="h6">{flight.crew_details.crew_id}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Qualifications</Typography>
                  <Box sx={{ mt: 1 }}>
                    {flight.crew_details.qualifications.map((qual) => (
                      <Chip 
                        key={qual}
                        label={qual}
                        sx={{ mr: 1, mb: 1 }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Duty Hours</Typography>
                  <Typography variant="h6">{flight.crew_details.duty_hours} hours</Typography>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="warning">No crew assigned</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FlightDetails;