import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { addAircraft } from '../services/api';

function AircraftPage({ aircraft, loading, refreshData }) {
  const { tail_number } = useParams();

  // AircraftDetails state and functions (from AircraftDetails.jsx)
  const [aircraftDetails, setAircraftDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    if (tail_number) {
      const fetchAircraft = async () => {
        try {
          setDetailsLoading(true);
          setDetailsError(null);
          const response = await fetch(`http://localhost:5000/aircraft/${tail_number}`);
          if (!response.ok) throw new Error('Aircraft not found');
          const data = await response.json();
          setAircraftDetails(data);
        } catch (error) {
          setDetailsError(error.message);
        } finally {
          setDetailsLoading(false);
        }
      };
      fetchAircraft();
      const interval = setInterval(fetchAircraft, 30000);
      return () => clearInterval(interval);
    }
  }, [tail_number]);

  // Form state and functions (from AircraftPage.jsx)
  const initialFormState = {
    tail_number: '',
    subtype: '',
    capacity: '',
    fuel_efficiency: '',
    current_location: '',
    available_from: null
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tail_number) newErrors.tail_number = 'Tail number is required';
    if (!formData.subtype) newErrors.subtype = 'Aircraft subtype is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.fuel_efficiency) newErrors.fuel_efficiency = 'Fuel efficiency is required';
    if (!formData.current_location) newErrors.current_location = 'Current location is required';
    if (!formData.available_from) newErrors.available_from = 'Available from date is required';
    if (formData.capacity && isNaN(Number(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a number';
    }
    if (formData.fuel_efficiency && isNaN(Number(formData.fuel_efficiency))) {
      newErrors.fuel_efficiency = 'Fuel efficiency must be a number';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const aircraftDataForApi = {
      ...formData,
      capacity: Number(formData.capacity),
      fuel_efficiency: Number(formData.fuel_efficiency),
      available_from: formData.available_from ? formData.available_from.toISOString() : ''
    };
    setFormLoading(true);
    setSuccess(false);
    setErrorMessage('');
    try {
      await addAircraft(aircraftDataForApi);
      setSuccess(true);
      setFormData(initialFormState);
      refreshData();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add aircraft');
    } finally {
      setFormLoading(false);
    }
  };

  // AircraftList component (from AircraftPage.jsx)
  const AircraftList = () => {
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
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
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
                  <Typography color="text.secondary" variant="body2">Subtype</Typography>
                  <Typography>{plane.subtype}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">Capacity</Typography>
                  <Typography>{plane.capacity} passengers</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">Fuel Efficiency</Typography>
                  <Typography>{plane.fuel_efficiency} kg/km</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary" variant="body2">Current Location</Typography>
                  <Typography>{plane.current_location}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary" variant="body2">Available From</Typography>
                  <Typography>{format(new Date(plane.available_from), 'PPp')}</Typography>
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
  };

  // Render Aircraft Details
  if (tail_number) {
    if (detailsLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (detailsError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{detailsError}</Alert>
        </Box>
      );
    }
    if (!aircraftDetails) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="info">No data available for this aircraft.</Alert>
        </Box>
      );
    }
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Aircraft {aircraftDetails.tail_number}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Subtype</Typography>
                  <Typography variant="h6">{aircraftDetails.subtype}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Capacity</Typography>
                  <Typography variant="h6">{aircraftDetails.capacity} passengers</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Fuel Efficiency</Typography>
                  <Typography variant="h6">{aircraftDetails.fuel_efficiency} kg/km</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Current Location</Typography>
                  <Typography variant="h6">{aircraftDetails.current_location}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Hours Flown</Typography>
                  <Typography variant="h6">{aircraftDetails.hours_flown} hours</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Total Flights</Typography>
                  <Typography variant="h6">{aircraftDetails.total_flights}</Typography>
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
                    {format(new Date(aircraftDetails.available_from), 'PPP p')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary">Maintenance Status</Typography>
                  <Chip
                    label={aircraftDetails.needs_maintenance ? "Maintenance Required" : "Operational"}
                    color={aircraftDetails.needs_maintenance ? "error" : "success"}
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Trip History</Typography>
              {aircraftDetails.trips.length > 0 ? (
                <List>
                  {aircraftDetails.trips.map((trip) => (
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

  // Render Aircraft Form and List
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Aircraft Management</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Add New Aircraft</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Collapse in={success}>
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
              Aircraft added successfully!
            </Alert>
          </Collapse>
          <Collapse in={!!errorMessage}>
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
              {errorMessage}
            </Alert>
          </Collapse>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                name="tail_number"
                label="Tail Number"
                fullWidth
                value={formData.tail_number}
                onChange={handleInputChange}
                error={!!errors.tail_number}
                helperText={errors.tail_number}
                required
                disabled={formLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                name="subtype"
                label="Aircraft Subtype"
                fullWidth
                value={formData.subtype}
                onChange={handleInputChange}
                error={!!errors.subtype}
                helperText={errors.subtype}
                required
                disabled={formLoading}
                placeholder="e.g., Boeing 737"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                name="capacity"
                label="Capacity"
                type="number"
                fullWidth
                value={formData.capacity}
                onChange={handleInputChange}
                error={!!errors.capacity}
                helperText={errors.capacity}
                required
                disabled={formLoading}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                name="fuel_efficiency"
                label="Fuel Efficiency"
                type="number"
                fullWidth
                value={formData.fuel_efficiency}
                onChange={handleInputChange}
                error={!!errors.fuel_efficiency}
                helperText={errors.fuel_efficiency}
                required
                disabled={formLoading}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                name="current_location"
                label="Current Location"
                fullWidth
                value={formData.current_location}
                onChange={handleInputChange}
                error={!!errors.current_location}
                helperText={errors.current_location}
                required
                disabled={formLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth error={!!errors.available_from}>
                <DateTimePicker
                  label="Available From"
                  value={formData.available_from}
                  onChange={(newValue) => handleDateChange('available_from', newValue)}
                  disabled={formLoading}
                  slotProps={{
                    textField: { required: true, error: !!errors.available_from }
                  }}
                />
                {errors.available_from && <FormHelperText>{errors.available_from}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formLoading}
                sx={{ mt: 1 }}
              >
                {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Aircraft'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Aircraft Fleet</Typography>
        <AircraftList />
      </Paper>
    </Box>
  );
}

export default AircraftPage;