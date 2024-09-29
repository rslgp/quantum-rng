import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography, Link, TextField, Divider, IconButton, InputAdornment } from '@mui/material';
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

const App = () => {
  const [quantumNumbers, setQuantumNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility state

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
      console.error('Failed with API Key:', apiKey);
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
      setMessage("I'm sorry Dave, I'm afraid I can't do that - HAL 2001: A Space Odyssey (1968)");
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
          Huge Gratitude for <Link href="https://quantumnumbers.anu.edu.au/">Australian National University (ANU)</Link>
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
