import React, { useState } from 'react';
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
  Collapse
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { addCrew } from '../services/api';

function CrewPage({ crews, loading, refreshData }) {
  // CrewForm state and functions (originally from CrewForm.jsx)
  const initialFormState = {
    crew_id: '',
    qualifications: '',
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
    if (!formData.crew_id) newErrors.crew_id = 'Crew ID is required';
    if (!formData.qualifications) newErrors.qualifications = 'Qualifications are required';
    if (!formData.current_location) newErrors.current_location = 'Current location is required';
    if (!formData.available_from) newErrors.available_from = 'Available from date is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const crewDataForApi = {
      ...formData,
      available_from: formData.available_from ? formData.available_from.toISOString() : ''
    };
    setFormLoading(true);
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
      setFormLoading(false);
    }
  };

  // CrewList component (originally from CrewList.jsx)
  const CrewList = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (!crews || crews.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No crews available. Add a crew to get started.
          </Typography>
        </Box>
      );
    }
    return (
      <Grid container spacing={3}>
        {crews.map((crew) => (
          <Grid item xs={12} sm={6} md={4} key={crew.crew_id}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
            >
              <Typography variant="h6" gutterBottom>{crew.crew_id}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography color="text.secondary" variant="body2">Qualifications</Typography>
                  <Box sx={{ mt: 1 }}>
                    {crew.qualifications.split(',').map((qual, index) => (
                      <Chip key={index} label={qual.trim()} size="small" sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">Current Location</Typography>
                  <Typography>{crew.current_location}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">Available From</Typography>
                  <Typography>{format(new Date(crew.available_from), 'PPp')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">Duty Hours</Typography>
                  <Typography>{crew.duty_hours.toFixed(1)} hours</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" variant="body2">Total Flights</Typography>
                  <Typography>{crew.total_flights}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Main render (originally from CrewPage.jsx)
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Crew Management</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Add New Crew</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Collapse in={success}>
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
              Crew added successfully!
            </Alert>
          </Collapse>
          <Collapse in={!!errorMessage}>
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
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
                disabled={formLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="qualifications"
                label="Qualifications"
                fullWidth
                value={formData.qualifications}
                onChange={handleInputChange}
                error={!!errors.qualifications}
                helperText={errors.qualifications}
                required
                disabled={formLoading}
                placeholder="e.g., Boeing 737, Airbus A320"
              />
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
                disabled={formLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth error={!!errors.available_from}>
                <DateTimePicker
                  label="Available From"
                  value={formData.available_from}
                  onChange={(newValue) => handleDateChange('available_from', newValue)}
                  disabled={formLoading}
                  slotProps={{ textField: { required: true, error: !!errors.available_from } }}
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
                {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Crew'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Crew Members</Typography>
        <CrewList />
      </Paper>
    </Box>
  );
}

export default CrewPage;