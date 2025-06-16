import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';

function AircraftDetails() {
  const { tail_number } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/aircraft/${tail_number}`);
        if (!response.ok) throw new Error('Aircraft not found');
        const data = await response.json();
        setAircraft(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAircraft();
    const interval = setInterval(fetchAircraft, 30000);
    return () => clearInterval(interval);
  }, [tail_number]);

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

  if (!aircraft) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No data available for this aircraft.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Aircraft {aircraft.tail_number}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="text.secondary">Subtype</Typography>
                <Typography variant="h6">{aircraft.subtype}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Capacity</Typography>
                <Typography variant="h6">{aircraft.capacity} passengers</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Fuel Efficiency</Typography>
                <Typography variant="h6">{aircraft.fuel_efficiency} kg/km</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Current Location</Typography>
                <Typography variant="h6">{aircraft.current_location}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Hours Flown</Typography>
                <Typography variant="h6">{aircraft.hours_flown} hours</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary">Total Flights</Typography>
                <Typography variant="h6">{aircraft.total_flights}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Status</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography color="text.secondary">Available From</Typography>
                <Typography variant="h6">
                  {format(new Date(aircraft.available_from), 'PPP p')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="text.secondary">Maintenance Status</Typography>
                <Chip 
                  label={aircraft.needs_maintenance ? "Maintenance Required" : "Operational"}
                  color={aircraft.needs_maintenance ? "error" : "success"}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Trip History</Typography>
            {aircraft.trips.length > 0 ? (
              <List>
                {aircraft.trips.map((trip) => (
                  <ListItem 
                    key={trip.flight_id}
                    component={Paper}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  >
                    <ListItemText
                      primary={
                        <Link 
                          to={`/flights/${trip.flight_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography variant="subtitle1">
                            Flight {trip.flight_id}: {trip.route}
                          </Typography>
                        </Link>
                      }
                      secondary={
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">
                              Departure: {format(new Date(trip.dep_time), 'PPp')}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">
                              Arrival: {format(new Date(trip.arr_time), 'PPp')}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">
                              CO2 Emitted: {trip.co2_emitted.toLocaleString()} kg
                            </Typography>
                          </Grid>
                        </Grid>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No trips recorded yet.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AircraftDetails;