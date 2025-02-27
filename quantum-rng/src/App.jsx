import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Typography, Link, TextField, Divider, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ThemeProvider, createTheme, rgbToHex } from '@mui/material/styles';
import QuantumCommunication from './modules/message1/QuantumCommunication';
import AuthContainer from './modules/auth/AuthContainer';
import SubscriptionPanels from './modules/payment/SubscriptionPanels';

const lab_url = import.meta.env.VITE_API_URL || '/vacuumquantum';

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
  const [vacuumquantum, setVacuumquantum] = useState({ majorityResult: '', result: [] });
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility state
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [numResults, setNumResults] = useState(3);
  const [showPremium, setShowPremium] = useState(true); // Toggle visibility state

  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage (if available)
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // fetch("http://localhost:3000/api/user", 
    // { 
    //   method: "GET",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json", // Ensure proper content type
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((user) => {
    //     console.log("LOGGED1", user);
    //     if (user) {
    //       console.log("LOGGED", user);
    //       setUser(user);
    //     }
    //   })
    //   .catch(() => setUser(null));
  }, []);

  const fetchQuantumNumbers = async (apiKey) => {
    const response = await fetch(
      `${lab_url}?length=${numResults}&type=uint8&size=1`,
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

    setup(convertedNumbers);
    setMessage(''); // Clear message if successful
  };

  // const stripeCheckout = async (product = 'mais_decisoes', quantity = 1) => {

  //   setLoadingPremium(true);

  //   //const response = await fetch(
  //   //  `/backend/payment/stripe/checkout`,
  //   //  {
  //   //    method: 'GET',
  //   //  }
  //   //);
  //   const url_stripe_checkout = `/quantum-rng/stripe-checkout.html?product=${product}&amount=${quantity}`;
  //   const newWindow = window.open(url_stripe_checkout, '_blank');
  //   if (newWindow) {
  //     newWindow.opener = null;  // Prevent access to the opener
  //     newWindow.location.replace(url_stripe_checkout);  // Ensure referrer info isn't sent
  //   }

  //   const eventSource = new EventSource(`/backend/event/subscribe`);
  //   eventSource.onmessage = async (event) => {
  //     console.log('SSE res', event);
  //     // update this session
  //     const response = await fetch('/auth/patch_premium');
  //     setUser(await response.json());
  //     setLoadingPremium(false);
  //   };

  //   // Handle errors
  //   eventSource.onerror = (error) => {
  //     console.error('SSE error:', error);
  //     eventSource.close(); // Reconnect if needed
  //   };

  // }

  const handleFetch = async () => {
    setLoading(true);

    const response = await fetch(
      `/vacuumquantum`,
      {
        method: 'GET',
      }
    );
    const body_json = await response.json();
    if (!response.ok) {
      setLoading(false);
      setMessage(
        `Limite atingindo aguarde: ${body_json.missingTime || "8 horas"} ou compre o reset de limite`
      );
      throw new Error('Network error');
    };

    console.log(body_json.result);
    if (body_json.result) {
      const { success, data } = body_json.result;
      if (success === false) {
        // If all attempts fail, show HAL 2001 message
        setMessage(
          "I'm sorry Dave, I'm afraid I can't do that - HAL 2001: A Space Odyssey (1968)"
        );

      } else {

        setup(data);
        setMessage(''); // Clear message if successful

      }
    }

    if (body_json.missingTime) {
      setShowPremium(true);
      setMessage(`você pode usar novamente em: ${body_json.missingTime}`); // Clear message if successful
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

  const setup = (quantumNumbers) => {
    const convertToFivePointScale = (value) => {
      // Normalize the value to the standard normal distribution
      // Assuming values are in the range [0, 100], with a mean of 50 and standard deviation of ~17
      const mean = 50;
      const stdDev = 17; // Rough approximation for 68% coverage

      // Calculate z-score
      const zScore = (value - mean) / stdDev;
      if (zScore <= -1.5) return { value: 'Very Negative', scale: -2 };  // Lower tail
      if (zScore <= -0.5) return { value: 'Negative', scale: -1 };       // Below average
      if (zScore <= 0.5) return { value: 'Neutral', scale: 0 };         // Near mean
      if (zScore <= 1.5) return { value: 'Positive', scale: 1 };        // Above average
      return { value: 'Very Positive', scale: 2 };                      // Upper tail
    };


    const data = quantumNumbers;
    const maxValue = 100, minValue = 0;

    const convertedNumbers = data
      .map((num) => Math.floor((num / 255) * (maxValue - minValue) + minValue))
      .sort((a, b) => b - a);


    const counts = {
      'Very Negative': 0,
      'Negative': 0,
      'Neutral': 0,
      'Positive': 0,
      'Very Positive': 0,
    };

    // Convert all quantum numbers to the five-point scale and store them
    const result = [];


    // Count the occurrences of each sentiment
    convertedNumbers.forEach((value) => {
      const text = convertToFivePointScale(value);
      result.push({ value, text });
      counts[text.value]++;
    });

    const getMajority = (counts) => {
      // Aggregate counts into 3 options
      const aggregatedCounts = {
        Negative: counts['Very Negative'] + counts['Negative'],
        Neutral: counts['Neutral'],
        Positive: counts['Very Positive'] + counts['Positive'],
      };

      // Determine the majority result
      let majorityResult;
      if (aggregatedCounts.Negative > aggregatedCounts.Positive && aggregatedCounts.Negative > aggregatedCounts.Neutral) {
        majorityResult = 'Negative';
      } else if (aggregatedCounts.Positive > aggregatedCounts.Negative && aggregatedCounts.Positive > aggregatedCounts.Neutral) {
        majorityResult = 'Positive';
      } else {
        majorityResult = 'Neutral\nFree Will + Arbítrio'; // Neutral is the default if there's a tie or no clear majority
      }
      return "Resposta:\n" + majorityResult;
    }

    // Find the majority result
    const majorityResult = getMajority(counts);
    const vacuumquantum = { majorityResult, result };
    setVacuumquantum(vacuumquantum);
    return vacuumquantum;
  }

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
        <Typography variant="h4" gutterBottom sx={{ display: 'none' }}>
          Quantum Random Number Generator
        </Typography>
        <Typography variant="h4" gutterBottom>
          Tech Decision Arbitrio
        </Typography>

        <TextField
          label="Enter Password"
          type={showPassword ? 'text' : 'password'} // Toggle between text and password types
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={handlePasswordKeyPress} // Trigger action on "Enter"
          sx={{ m: 1 }}
          name="password" // Add a name attribute to help password managers
          autoComplete="current-password" // Allow Google Password Manager to identify the field
          slotProps={{
            input: {
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
            },
          }}
        />

        <AuthContainer user={user} setUser={setUser} />
        <br />
        {
          user ? "logado" : "incognito"
        }

        <Typography graphy variant="body1" gutterBottom>
          Click the button to fetch a Decision.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetch}
          disabled={loading}
          sx={{
            mb: '4vh',                // Responsive bottom margin
            fontSize: '4vh',          // Scales text size with viewport width
            minWidth: '80vw',         // Ensures button remains wide
            minHeight: '22vh',         // Taller button for better UX
            borderRadius: '8px',      // Rounded corners for modern design
            textTransform: 'none',    // Keeps text readable (avoid all caps)
            display: 'flex',         // Ensures content is centered
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'EXTERNAL HELP'}
        </Button>

        <Typography variant="h6" sx={{ whiteSpace: 'pre-line' }}>
          {vacuumquantum.majorityResult}
        </Typography>
        <Box sx={{ mt: 3, width: '40vw' }}>
          {vacuumquantum.result.map((result, index) => (
            <Box key={index} sx={{ mb: 4, width: '100%' }}> {/* Increased margin-bottom and full width */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                {result.text.value} ({result.value}%)
              </Typography>
              <Box
                sx={{
                  height: 30, // Increased height of the progress bar
                  width: '100%', // Full width
                  background: '#292929',
                  transition: 'width 0.5s ease, opacity 0.5s ease',
                  borderRadius: 3, // More rounded corners
                  boxShadow: 3, // Stronger shadow
                  border: '1px solid rgba(0, 0, 0, 0.1)', // Subtle border
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${result.value}%`,
                    background: getBarColor(result.text.value), // Light overlay for depth
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        {message && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}


        {showPremium && (


          <>

            {user && (
              <>
                {/* 
              
                <Button
                  variant="contained"
                  color="primary"
                  onClick={stripeCheckout}
                  disabled={loadingPremium}
                  sx={{
                    mb: '4vh',                // Responsive bottom margin
                    fontSize: { xs: '22px', sm: '22px' },          // Scales text size with viewport width
                    // minWidth: '80vw',         // Ensures button remains wide
                    // minHeight: '22vh',         // Taller button for better UX
                    borderRadius: '8px',      // Rounded corners for modern design
                    textTransform: 'none',    // Keeps text readable (avoid all caps)
                    display: 'flex',         // Ensures content is centered
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {loadingPremium ? <CircularProgress size={24} /> : 'Quero ser Premium \ne ter mais Decisoes'}
                </Button> 
                
                */}
                <SubscriptionPanels user={user} setUser={setUser}></SubscriptionPanels>
              </>
            )}
          </>
        )}


        <QuantumCommunication></QuantumCommunication>

        <Box sx={{ display: 'none' }}>
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
      </Box>
    </ThemeProvider>
  );
};

export default App;
