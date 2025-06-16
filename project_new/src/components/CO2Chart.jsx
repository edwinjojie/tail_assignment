import React from 'react';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CO2Chart({ assignments, mode }) {
  if (!assignments || assignments.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No data available to display CO2 emissions.
        </Typography>
      </Box>
    );
  }

  const emissionsByAircraft = assignments.reduce((acc, flight) => {
    const { tail_number, co2_emitted } = flight;
    if (!acc[tail_number]) {
      acc[tail_number] = 0;
    }
    acc[tail_number] += co2_emitted;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(emissionsByAircraft),
    datasets: [
      {
        label: 'CO2 Emissions (kg)',
        data: Object.values(emissionsByAircraft),
        backgroundColor: mode === 'dark' 
          ? 'rgba(76, 175, 80, 0.5)'
          : 'rgba(46, 125, 50, 0.7)',
        borderColor: mode === 'dark'
          ? 'rgba(76, 175, 80, 0.8)'
          : 'rgba(46, 125, 50, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: mode === 'dark' ? '#ffffff' : '#000000',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${value.toLocaleString()} kg CO2`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: mode === 'dark' ? '#ffffff' : '#000000',
          callback: (value) => value.toLocaleString(),
        },
        title: {
          display: true,
          text: 'CO2 Emissions (kg)',
          color: mode === 'dark' ? '#ffffff' : '#000000',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          color: mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: mode === 'dark' ? '#ffffff' : '#000000',
        },
        title: {
          display: true,
          text: 'Aircraft',
          color: mode === 'dark' ? '#ffffff' : '#000000',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <Box sx={{ height: 300, position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
}

export default CO2Chart;