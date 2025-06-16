import React, { useState } from 'react';
import { 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  FormHelperText, 
  Autocomplete,
  Chip,
  Box,
  Alert,
  Collapse,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { addCrew } from '../services/api';

// Common aircraft types for autocomplete
const commonAircraftTypes = [
  'Boeing 737',
  'Boeing 747',
  'Boeing 777',
  'Boeing 787',
  'Airbus A320',
  'Airbus A330',
  'Airbus A350',
  'Airbus A380',
  'Embraer E190',
  'Bombardier CRJ'
];

function CrewForm({ refreshData }) {
  const initialFormState = {
    crew_id: '',
    qualifications: [],
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

  const handleQualificationsChange = (event, newValue) => {
    setFormData({
      ...formData,
      qualifications: newValue
    });
    
    // Clear error for this field if it exists
    if (errors.qualifications) {
      setErrors({
        ...errors,
        qualifications: ''
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
    if (!formData.crew_id) newErrors.crew_id = 'Crew ID is required';
    if (!formData.qualifications || formData.qualifications.length === 0) {
      newErrors.qualifications = 'At least one qualification is required';
    }
    if (!formData.current_location) newErrors.current_location = 'Current location is required';
    if (!formData.available_from) newErrors.available_from = 'Available from date is required';
    
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
    const crewDataForApi = {
      ...formData,
      available_from: formData.available_from ? formData.available_from.toISOString() : ''
    };
    
    setLoading(true);
    setSuccess(false);
    setErrorMessage('');
    
    try {
      await addCrew(crewDataForApi);
      setSuccess(true);
      setFormData(initialFormState);
      refreshData();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add crew');
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
          Crew added successfully!
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
            name="crew_id"
            label="Crew ID"
            fullWidth
            value={formData.crew_id}
            onChange={handleInputChange}
            error={!!errors.crew_id}
            helperText={errors.crew_id}
            required
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth error={!!errors.qualifications}>
            <Autocomplete
              multiple
              options={commonAircraftTypes}
              value={formData.qualifications}
              onChange={handleQualificationsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip 
                    label={option} 
                    {...getTagProps({ index })} 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Qualifications"
                  placeholder="Add aircraft types"
                  error={!!errors.qualifications}
                  helperText={errors.qualifications}
                  required
                />
              )}
              disabled={loading}
              freeSolo
            />
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
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
        
        <Grid item xs={12} sm={6} md={3}>
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
              'Add Crew'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CrewForm;