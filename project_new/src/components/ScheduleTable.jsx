import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Fade
} from '@mui/material';
import { format } from 'date-fns';

function ScheduleTable({ assignments, unassignedFlights, loading }) {
  if (loading) {
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
}

export default ScheduleTable;