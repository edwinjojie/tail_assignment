import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  Alert, 
  AlertTitle,
  Fade,
  Paper
} from '@mui/material';
import { AlertTriangle, PenTool as Tool, Users, Plane } from 'lucide-react';

function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No alerts at this time. Everything is running smoothly!
        </Typography>
      </Box>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return <Tool size={20} />;
      case 'crew':
        return <Users size={20} />;
      default:
        return <AlertTriangle size={20} />;
    }
  };

  const getAlertSeverity = (type) => {
    switch (type) {
      case 'maintenance':
        return 'error';
      case 'crew':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getAlertTitle = (type) => {
    switch (type) {
      case 'maintenance':
        return 'Maintenance Alert';
      case 'crew':
        return 'Crew Availability';
      default:
        return 'System Alert';
    }
  };

  return (
    <List sx={{ width: '100%', mb: 2 }}>
      {alerts.map((alert, index) => (
        <Fade 
          in={true} 
          key={index}
          timeout={300} 
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <ListItem sx={{ px: 0, py: 1 }}>
            <Alert 
              severity={getAlertSeverity(alert.type)}
              icon={getAlertIcon(alert.type)}
              sx={{ 
                width: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                '& .MuiAlert-icon': {
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <AlertTitle>{getAlertTitle(alert.type)}</AlertTitle>
              {alert.message}
            </Alert>
          </ListItem>
        </Fade>
      ))}
    </List>
  );
}

export default AlertsPanel;