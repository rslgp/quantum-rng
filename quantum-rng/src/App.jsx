import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography, Link, TextField, Divider, IconButton, InputAdornment, Slider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
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

// const convertToFivePointScale = (value) => {
//   if (value <= 20) return 'Very Negative'; // Very negative
//   if (value <= 40) return 'Negative'; // Negative
//   if (value <= 60) return 'Neutral'; // Neutral
//   if (value <= 80) return 'Positive'; // Positive
//   return 'Very Positive'; // Very positive
// };

const convertToFivePointScale = (value) => {
  // Normalize the value to the standard normal distribution
  // Assuming values are in the range [0, 100], with a mean of 50 and standard deviation of ~17
  const mean = 50;
  const stdDev = 17; // Rough approximation for 68% coverage
  
  // Calculate z-score
  const zScore = (value - mean) / stdDev;

  if (zScore <= -1.5) return 'Very Negative';  // Lower tail
  if (zScore <= -0.5) return 'Negative';       // Below average
  if (zScore <= 0.5) return 'Neutral';         // Near mean
  if (zScore <= 1.5) return 'Positive';        // Above average
  return 'Very Positive';                      // Upper tail
};


// Color scale from red to green based on the value
const getBarColor = (value) => {
  if (value === 'Very Negative') return '#f44336'; // Red
  if (value === 'Negative') return '#ff9800'; // Orange
  if (value === 'Neutral') return '#9e9e9e'; // Gray
  if (value === 'Positive') return '#8bc34a'; // Light Green
  if (value === 'Very Positive') return '#4caf50'; // Green
  return '#9e9e9e'; // Default to Gray
};

const App = () => {
  const [quantumNumbers, setQuantumNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility state
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
        .map((num) => Math.floor((num / 255) * (maxValue - minValue) + minValue))
        .sort((a, b) => b - a);

      setQuantumNumbers(convertedNumbers);
      setMessage(''); // Clear message if successful
    } catch (error) {
      throw error; // Rethrow error to handle retries
    }
  };

  const handleFetch = async () => {
    setLoading(true);

    const apiKeys = [import.meta.env.VITE_API_KEY]; // Start with the first API key

    if (password === import.meta.env.VITE_PRIVATE) {
      apiKeys.push(
        import.meta.env.VITE_API_KEY2,
        import.meta.env.VITE_API_KEY3,
        import.meta.env.VITE_API_KEY4
      );
    }

    let success = false;

    // Attempt fetching using each API key in sequence
    for (const apiKey of apiKeys) {
      try {
        await fetchQuantumNumbers(apiKey);
        success = true; // Mark success on first successful fetch
        break; // Stop trying once successful
      } catch (error) {
        // Continue to the next API key if one fails
        continue;
      }
    }

    if (!success) {
      // If all attempts fail, show HAL 2001 message
      setMessage(
        "I'm sorry Dave, I'm afraid I can't do that - HAL 2001: A Space Odyssey (1968)"
      );
      setQuantumNumbers([]);
    }

    setLoading(false);
  };

  const handlePasswordKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleFetch(); // Trigger fetch on "Enter" key press
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
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

        <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
          Huge Gratitude for{' '}
          <Link href="https://quantumnumbers.anu.edu.au/">
            Australian National University (ANU)
          </Link>
        </Typography>

        <TextField
          label="Enter Password"
          type={showPassword ? 'text' : 'password'} // Toggle between text and password types
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handlePasswordKeyPress} // Trigger action on "Enter"
          sx={{ m: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleFetch}
          disabled={loading}
          sx={{ mb: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Random Numbers'}
        </Button>

        <Box sx={{ mt: 4 }}>
          {quantumNumbers.length > 0 && (
            <>
              <Typography variant="h6">Quantum Numbers (Sorted):</Typography>
              {quantumNumbers.map((num, index) => {
                const convertedValue = convertToFivePointScale(num);
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        height: 20,
                        width: `${['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'].indexOf(convertedValue) * 25 + 25}%`,
                        backgroundColor: getBarColor(convertedValue),
                        transition: 'width 0.3s ease',
                        mr: 2,
                      }}
                    />
                    <Typography variant="body1">
                      {convertedValue} ({num})
                    </Typography>
                  </Box>
                );
              })}
            </>
          )}
        </Box>

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
