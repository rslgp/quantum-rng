import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography, Link, TextField, Divider } from '@mui/material';
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
  
  // State for user inputs
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [numResults, setNumResults] = useState(3);

  const fetchQuantumNumbers = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}?length=${numResults}&type=uint8&size=1`,
        {
          method: 'GET',
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
          },
        }
      );

      const data = await response.json();

      // Convert numbers from (0-255) to (minValue-maxValue), sort, and set to state
      const convertedNumbers = data.data.map(num => {
        const scaledNum = Math.floor((num / 255) * (maxValue - minValue) + minValue);
        return scaledNum;
      }).sort((a, b) => b - a);

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
          Click the button to fetch random numbers.
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

        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" gutterBottom>
          customize:
        </Typography>

        <TextField
          label="Minimum Value min 0"
          type="number"
          variant="outlined"
          value={minValue}
          onChange={(e) => setMinValue(Number(e.target.value))}
          sx={{ m: 1 }}
        />
        
        <TextField
          label="Maximum Value max 255"
          type="number"
          variant="outlined"
          value={maxValue}
          onChange={(e) => setMaxValue(Number(e.target.value))}
          sx={{ m: 1 }}
        />
        
        <TextField
          label="Number of Results"
          type="number"
          variant="outlined"
          value={numResults}
          onChange={(e) => setNumResults(Number(e.target.value))}
          sx={{ m: 1 }}
          inputProps={{ min: 1 }} // Minimum number of results to fetch
        />

      </Box>
    </ThemeProvider>
  );
};

export default App;
