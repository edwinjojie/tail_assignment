import React, { useState } from 'react';
import { 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  FormHelperText,
  Box,
  Alert,
  Collapse,
  Fade,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { addFlight } from '../services/api';

function FlightForm({ refreshData }) {
  const initialFormState = {
    flight_id: '',
    route: '',
    origin: '',
    destination: '',
    distance: '',
    dep_time: null,
    arr_time: null,
    required_subtype: '',
    passengers: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleDateChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.flight_id) newErrors.flight_id = 'Flight ID is required';
    if (!formData.route) newErrors.route = 'Route is required';
    if (!formData.origin) newErrors.origin = 'Origin is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.distance) newErrors.distance = 'Distance is required';
    if (!formData.dep_time) newErrors.dep_time = 'Departure time is required';
    if (!formData.arr_time) newErrors.arr_time = 'Arrival time is required';
    if (!formData.required_subtype) newErrors.required_subtype = 'Required aircraft subtype is required';
    if (!formData.passengers) newErrors.passengers = 'Passenger count is required';
    
    // Numeric validation
    if (formData.distance && isNaN(Number(formData.distance))) {
      newErrors.distance = 'Distance must be a number';
    }
    
    if (formData.passengers && isNaN(Number(formData.passengers))) {
      newErrors.passengers = 'Passenger count must be a number';
    }
    
    // Date validation
    if (formData.dep_time && formData.arr_time) {
      const depTime = new Date(formData.dep_time);
      const arrTime = new Date(formData.arr_time);
      
      if (arrTime <= depTime) {
        newErrors.arr_time = 'Arrival time must be after departure time';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Format data for API
    const flightDataForApi = {
      ...formData,
      distance: Number(formData.distance),
      passengers: Number(formData.passengers),
      dep_time: formData.dep_time ? formData.dep_time.toISOString() : '',
      arr_time: formData.arr_time ? formData.arr_time.toISOString() : ''
    };
    
    setLoading(true);
    setSuccess(false);
    setErrorMessage('');
    
    try {
      await addFlight(flightDataForApi);
      setSuccess(true);
      setFormData(initialFormState);
      refreshData();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add flight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Collapse in={success}>
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setSuccess(false)}
        >
          Flight added successfully! The schedule has been optimized.
        </Alert>
      </Collapse>
      
      <Collapse in={!!errorMessage}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setErrorMessage('')}
        >
          {errorMessage}
        </Alert>
      </Collapse>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="flight_id"
            label="Flight ID"
            fullWidth
            value={formData.flight_id}
            onChange={handleInputChange}
            error={!!errors.flight_id}
            helperText={errors.flight_id}
            required
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="route"
            label="Route"
            fullWidth
            value={formData.route}
            onChange={handleInputChange}
            error={!!errors.route}
            helperText={errors.route}
            required
            disabled={loading}
            placeholder="e.g., Mumbai-Delhi"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="origin"
            label="Origin"
            fullWidth
            value={formData.origin}
            onChange={handleInputChange}
            error={!!errors.origin}
            helperText={errors.origin}
            required
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="destination"
            label="Destination"
            fullWidth
            value={formData.destination}
            onChange={handleInputChange}
            error={!!errors.destination}
            helperText={errors.destination}
            required
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="distance"
            label="Distance (km)"
            type="number"
            fullWidth
            value={formData.distance}
            onChange={handleInputChange}
            error={!!errors.distance}
            helperText={errors.distance}
            required
            disabled={loading}
            inputProps={{ min: 0 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth error={!!errors.dep_time}>
            <DateTimePicker
              label="Departure Time"
              value={formData.dep_time}
              onChange={(newValue) => handleDateChange('dep_time', newValue)}
              disabled={loading}
              slotProps={{
                textField: {
                  required: true,
                  error: !!errors.dep_time
                }
              }}
            />
            {errors.dep_time && <FormHelperText>{errors.dep_time}</FormHelperText>}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth error={!!errors.arr_time}>
            <DateTimePicker
              label="Arrival Time"
              value={formData.arr_time}
              onChange={(newValue) => handleDateChange('arr_time', newValue)}
              disabled={loading}
              slotProps={{
                textField: {
                  required: true,
                  error: !!errors.arr_time
                }
              }}
            />
            {errors.arr_time && <FormHelperText>{errors.arr_time}</FormHelperText>}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="required_subtype"
            label="Required Aircraft Subtype"
            fullWidth
            value={formData.required_subtype}
            onChange={handleInputChange}
            error={!!errors.required_subtype}
            helperText={errors.required_subtype}
            required
            disabled={loading}
            placeholder="e.g., Boeing 737"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="passengers"
            label="Passengers"
            type="number"
            fullWidth
            value={formData.passengers}
            onChange={handleInputChange}
            error={!!errors.passengers}
            helperText={errors.passengers}
            required
            disabled={loading}
            inputProps={{ min: 0 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ 
              height: '56px',
              mt: { xs: 0, md: '0px' }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Add Flight'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FlightForm;