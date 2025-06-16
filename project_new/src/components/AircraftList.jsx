import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Chip, 
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function AircraftList({ aircraft, loading }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!aircraft || aircraft.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No aircraft available. Add an aircraft to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {aircraft.map((plane) => (
        <Grid item xs={12} sm={6} md={4} key={plane.tail_number}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <Link 
              to={`/aircraft/${plane.tail_number}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Typography variant="h6" gutterBottom>
                {plane.tail_number}
              </Typography>
            </Link>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography color="text.secondary" variant="body2">
                  Subtype
                </Typography>
                <Typography>{plane.subtype}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography color="text.secondary" variant="body2">
                  Capacity
                </Typography>
                <Typography>{plane.capacity} passengers</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography color="text.secondary" variant="body2">
                  Fuel Efficiency
                </Typography>
                <Typography>{plane.fuel_efficiency} kg/km</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography color="text.secondary" variant="body2">
                  Current Location
                </Typography>
                <Typography>{plane.current_location}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography color="text.secondary" variant="body2">
                  Available From
                </Typography>
                <Typography>
                  {format(new Date(plane.available_from), 'PPp')}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Chip 
                  label={plane.needs_maintenance ? "Maintenance Required" : "Operational"}
                  color={plane.needs_maintenance ? "error" : "success"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default AircraftList;