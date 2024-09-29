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
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // State for user inputs
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [numResults, setNumResults] = useState(3);

  const fetchQuantumNumbers = async (apiKey) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}?length=${numResults}&type=uint8&size=1`,
        {
          method: 'GET',
          headers: {
            'x-api-key': apiKey, // Use dynamic API key
          },
        }
      );

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();

      // Convert numbers from (0-255) to (minValue-maxValue), sort, and set to state
      const convertedNumbers = data.data
        .map(num => Math.floor((num / 255) * (maxValue - minValue) + minValue))
        .sort((a, b) => b - a);

      setQuantumNumbers(convertedNumbers);
      setMessage(''); // Clear message if successful
    } catch (error) {
      // Handle network error, retry with VITE_API_KEY2 if password matches
      if (password === import.meta.env.VITE_PRIVATE) {
        try {
          const retryResponse = await fetch(
            `${import.meta.env.VITE_API_URL}?length=${numResults}&type=uint8&size=1`,
            {
              method: 'GET',
              headers: {
                'x-api-key': import.meta.env.VITE_API_KEY2,
              },
            }
          );
          if (!retryResponse.ok) throw new Error('Second network error');

          const retryData = await retryResponse.json();

          const convertedNumbers = retryData.data
            .map(num => Math.floor((num / 255) * (maxValue - minValue) + minValue))
            .sort((a, b) => b - a);

          setQuantumNumbers(convertedNumbers);
          setMessage(''); // Clear message if retry is successful
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      } else {
        // Show HAL 2001 message if password is incorrect
        setMessage("I'm sorry Dave, I'm afraid I can't do that - HAL 2001: A Space Odyssey (1968)");
        setQuantumNumbers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    setLoading(true);
    fetchQuantumNumbers(import.meta.env.VITE_API_KEY);
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

        <Typography variant="body1" gutterBottom sx={{ mb: 4 }}> {/* Added 44px padding */}
          Huge Gratitude for <Link href="https://quantumnumbers.anu.edu.au/">Australian National University (ANU)</Link>
        </Typography>

        <TextField
          label="Enter Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ m: 1 }}
        />

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleFetch} 
          disabled={loading}
          sx={{ mb: 4 }} // 44px padding
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

        {/* Display error or status message */}
        {message && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" gutterBottom>
          Customize:
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
          inputProps={{ min: 1 }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default App;
