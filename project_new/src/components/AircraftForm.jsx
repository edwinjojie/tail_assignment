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
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { addAircraft } from '../services/api';

function AircraftForm({ refreshData }) {
  const initialFormState = {
    tail_number: '',
    subtype: '',
    capacity: '',
    fuel_efficiency: '',
    current_location: '',
    available_from: null
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
    if (!formData.tail_number) newErrors.tail_number = 'Tail number is required';
    if (!formData.subtype) newErrors.subtype = 'Aircraft subtype is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.fuel_efficiency) newErrors.fuel_efficiency = 'Fuel efficiency is required';
    if (!formData.current_location) newErrors.current_location = 'Current location is required';
    if (!formData.available_from) newErrors.available_from = 'Available from date is required';
    
    // Numeric validation
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
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Format data for API
    const aircraftDataForApi = {
      ...formData,
      capacity: Number(formData.capacity),
      fuel_efficiency: Number(formData.fuel_efficiency),
      available_from: formData.available_from ? formData.available_from.toISOString() : ''
    };
    
    setLoading(true);
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
          Aircraft added successfully!
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth error={!!errors.available_from}>
            <DateTimePicker
              label="Available From"
              value={formData.available_from}
              onChange={(newValue) => handleDateChange('available_from', newValue)}
              disabled={loading}
              slotProps={{
                textField: {
                  required: true,
                  error: !!errors.available_from
                }
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
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Add Aircraft'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AircraftForm;