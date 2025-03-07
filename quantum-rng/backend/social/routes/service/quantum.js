const LAB_URL = process.env.VITE_API_LAB_URL;
const fetchQuantumNumbers = async (apiKey) => {
  const numResults = 3;

  const response = await fetch(
    `${LAB_URL}?length=${numResults}&type=uint8&size=1`,
    {
      method: 'GET',
      headers: {
        'x-api-key': apiKey, // Use dynamic API key
      },
    }
  );

  if (!response.ok) throw new Error('Network error');

  const data = await response.json();

  return data;
};

const apiKeysQuantum = process.env.VITE_API_KEY_QUANTUM.split(',');
const consultQuantum = async (req, res) => {
  //DEBUG ENABLE
  // res.json({ "result": { "success": true, "data": [167, 96, 134], "usage": 1 } });
  // return;

  let success = false;
  let response = null;
  // Attempt fetching using each API key in sequence
  for (const apiKey of apiKeysQuantum) {
    try {
      response = await fetchQuantumNumbers(apiKey);
      success = true; // Mark success on first successful fetch
      break; // Stop trying once successful
    } catch (error) {
      // Continue to the next API key if one fails
      continue;
    }
  }
  const result = {
    success,
    data: response?.data,
    usage: req.usage,
  }
  res.json({ result });
}

export default consultQuantum;