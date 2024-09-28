import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography, Link } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a dark theme using Material UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

const App = () => {
  const [quantumNumbers, setQuantumNumbers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuantumNumbers = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}?length=3&type=uint8&size=1`, // Fetching 10 random numbers between 0-255
        {
          method: 'GET',
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY, // Use API key from environment variables
          },
        }
      );
      
      const data = await response.json();

      // Convert numbers from (0-255) to (0-100), sort, and set to state
      const convertedNumbers = data.data.map(num => Math.floor((num / 255) * 100)).sort((a, b) => b - a);
      setQuantumNumbers(convertedNumbers);
    } catch (error) {
      console.error('Error fetching quantum numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Quantum Random Number Generator
        </Typography>

        <Typography variant="body1" gutterBottom>
          Click the button to fetch and display 3 random numbers between 0-100.
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Huge Gratitude for <Link href="https://quantumnumbers.anu.edu.au/">Australian National University (ANU)</Link>
        </Typography>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchQuantumNumbers} 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Random Numbers'}
        </Button>

        <Box sx={{ mt: 4 }}>
          {quantumNumbers.length > 0 && (
            <>
              <Typography variant="h6">Quantum Numbers (Sorted):</Typography>
              <Typography variant="body1">{quantumNumbers.join(', ')}</Typography>
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
