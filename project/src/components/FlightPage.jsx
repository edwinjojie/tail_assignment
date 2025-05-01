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
  Divider,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Modal,
  Backdrop,
  IconButton,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { addFlight } from '../services/api';
import CloseIcon from '@mui/icons-material/Close';

function FlightPage({ refreshData, assignments, unassignedFlights, loading: pageLoading }) {
  const { flight_id } = useParams();
  const [openModal, setOpenModal] = useState(false);

  // FlightForm state and functions
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
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.flight_id) newErrors.flight_id = 'Flight ID is required';
    if (!formData.route) newErrors.route = 'Route is required';
    if (!formData.origin) newErrors.origin = 'Origin is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.distance) newErrors.distance = 'Distance is required';
    if (!formData.dep_time) newErrors.dep_time = 'Departure time is required';
    if (!formData.arr_time) newErrors.arr_time = 'Arrival time is required';
    if (!formData.required_subtype) newErrors.required_subtype = 'Required aircraft subtype is required';
    if (!formData.passengers) newErrors.passengers = 'Passenger count is required';
    if (formData.distance && isNaN(Number(formData.distance))) {
      newErrors.distance = 'Distance must be a number';
    }
    if (formData.passengers && isNaN(Number(formData.passengers))) {
      newErrors.passengers = 'Passenger count must be a number';
    }
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
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
    const flightDataForApi = {
      ...formData,
      distance: Number(formData.distance),
      passengers: Number(formData.passengers),
      dep_time: formData.dep_time ? formData.dep_time.toISOString() : '',
      arr_time: formData.arr_time ? formData.arr_time.toISOString() : ''
    };
    setFormLoading(true);
    setFormSuccess(false);
    setFormErrorMessage('');
    try {
      await addFlight(flightDataForApi);
      setFormSuccess(true);
      setFormData(initialFormState);
      setOpenModal(false);
      refreshData();
    } catch (error) {
      setFormErrorMessage(error.message || 'Failed to add flight');
    } finally {
      setFormLoading(false);
    }
  };

  // FlightDetails state and functions
  const [flight, setFlight] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    if (flight_id) {
      const fetchFlight = async () => {
        try {
          setDetailsLoading(true);
          setDetailsError(null);
          const response = await fetch(`http://localhost:5000/flights/${flight_id}`);
          if (!response.ok) throw new Error('Flight not found');
          const data = await response.json();
          setFlight(data);
        } catch (error) {
          setDetailsError(error.message);
        } finally {
          setDetailsLoading(false);
        }
      };
      fetchFlight();
      const interval = setInterval(fetchFlight, 30000);
      return () => clearInterval(interval);
    }
  }, [flight_id]);

  // ScheduleTable component
  const ScheduleTable = () => {
    if (pageLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (assignments.length === 0 && unassignedFlights.length === 0) {
      return (
        <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
          No flights scheduled. Add flights to see them here.
        </Typography>
      );
    }
    const formatDateTime = (dateTimeStr) => {
      try {
        const date = new Date(dateTimeStr);
        return format(date, 'MMM d, yyyy h:mm a');
      } catch (e) {
        return dateTimeStr;
      }
    };
    return (
      <Fade in={true}>
        <TableContainer component={Paper} sx={{ maxHeight: '600px', overflow: 'auto', boxShadow: 'none' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Flight ID</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Departure</TableCell>
                <TableCell>Arrival</TableCell>
                <TableCell>Aircraft</TableCell>
                <TableCell>Crew</TableCell>
                <TableCell>CO2 (kg)</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((flight) => (
                <TableRow
                  key={flight.flight_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight={500}>
                      {flight.flight_id}
                    </Typography>
                  </TableCell>
                  <TableCell>{flight.route}</TableCell>
                  <TableCell>{formatDateTime(flight.dep_time)}</TableCell>
                  <TableCell>{formatDateTime(flight.arr_time)}</TableCell>
                  <TableCell>
                    <Chip
                      label={flight.tail_number}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={flight.crew_id}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {flight.co2_emitted.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Assigned"
                      size="small"
                      color="success"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {unassignedFlights.map((flightId) => (
                <TableRow
                  key={flightId}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: 'rgba(211, 47, 47, 0.05)'
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight={500}>
                      {flightId}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" fontStyle="italic" color="text.secondary">
                      Flight details not available
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Unassigned"
                      size="small"
                      color="error"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>
    );
  };

  // Render Flight Details
  if (flight_id) {
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
    if (!flight) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="info">No data available for this flight.</Alert>
        </Box>
      );
    }
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Flight {flight.flight_id}</Typography>
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
                      <Link to={`/aircraft/${flight.aircraft_details.tail_number}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                        <Chip key={qual} label={qual} sx={{ mr: 1, mb: 1 }} variant="outlined" />
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

  // Render Schedule Page with Add Flight Button
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Flight Schedule</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 3 }}
      >
        Add New Flight
      </Button>
      <Paper elevation={2} sx={{ p: 3 }}>
        <ScheduleTable />
      </Paper>

      {/* Add Flight Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: 800,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenModal(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>Add New Flight</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Collapse in={formSuccess}>
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFormSuccess(false)}>
                  Flight added successfully! The schedule has been optimized.
                </Alert>
              </Collapse>
              <Collapse in={!!formErrorMessage}>
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormErrorMessage('')}>
                  {formErrorMessage}
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
                    error={!!formErrors.flight_id}
                    helperText={formErrors.flight_id}
                    required
                    disabled={formLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    name="route"
                    label="Route"
                    fullWidth
                    value={formData.route}
                    onChange={handleInputChange}
                    error={!!formErrors.route}
                    helperText={formErrors.route}
                    required
                    disabled={formLoading}
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
                    error={!!formErrors.origin}
                    helperText={formErrors.origin}
                    required
                    disabled={formLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    name="destination"
                    label="Destination"
                    fullWidth
                    value={formData.destination}
                    onChange={handleInputChange}
                    error={!!formErrors.destination}
                    helperText={formErrors.destination}
                    required
                    disabled={formLoading}
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
                    error={!!formErrors.distance}
                    helperText={formErrors.distance}
                    required
                    disabled={formLoading}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth error={!!formErrors.dep_time}>
                    <DateTimePicker
                      label="Departure Time"
                      value={formData.dep_time}
                      onChange={(newValue) => handleDateChange('dep_time', newValue)}
                      disabled={formLoading}
                      slotProps={{ textField: { required: true, error: !!formErrors.dep_time } }}
                    />
                    {formErrors.dep_time && <FormHelperText>{formErrors.dep_time}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth error={!!formErrors.arr_time}>
                    <DateTimePicker
                      label="Arrival Time"
                      value={formData.arr_time}
                      onChange={(newValue) => handleDateChange('arr_time', newValue)}
                      disabled={formLoading}
                      slotProps={{ textField: { required: true, error: !!formErrors.arr_time } }}
                    />
                    {formErrors.arr_time && <FormHelperText>{formErrors.arr_time}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    name="required_subtype"
                    label="Required Aircraft Subtype"
                    fullWidth
                    value={formData.required_subtype}
                    onChange={handleInputChange}
                    error={!!formErrors.required_subtype}
                    helperText={formErrors.required_subtype}
                    required
                    disabled={formLoading}
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
                    error={!!formErrors.passengers}
                    helperText={formErrors.passengers}
                    required
                    disabled={formLoading}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={formLoading}
                    sx={{ height: '56px', mt: { xs: 0, md: '0px' } }}
                  >
                    {formLoading ? <CircularProgress size={24} color="inherit" /> : 'Add Flight'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}

export default FlightPage;