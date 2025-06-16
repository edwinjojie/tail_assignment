import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AircraftForm from './AircraftForm';
import AircraftList from './AircraftList';

function AircraftPage({ aircraft, loading, refreshData }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Aircraft Management</Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Add New Aircraft</Typography>
        <AircraftForm refreshData={refreshData} />
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Aircraft Fleet</Typography>
        <AircraftList aircraft={aircraft} loading={loading} />
      </Paper>
    </Box>
  );
}

export default AircraftPage;