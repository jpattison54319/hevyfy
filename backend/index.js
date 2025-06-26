const express = require('express');
const cors = require('cors');
const {get} = require('axios');

const app = express();
const PORT = process.env.PORT || 2025;

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

// Example Route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

// New route: Get workouts from the Hevy API
app.get('/api/hevy_workouts', async (req, res) => {
  try {
    // The Hevy API URL for workouts (check documentation for the correct endpoint)
    const apiUrl = 'https://api.hevyapp.com/v1/workouts';

    // If authentication or API keys are required, include them in headers or as query parameters.
    const params = {
      page: 1,
      pageSize: 5,
    };

    // Include required headers
    const headers = {
      accept: 'application/json',
      'api-key': 'bfabd56e-c05d-4ae4-873a-ee296986fb8d',
    };

    // Make the GET request
    const response = await get(apiUrl, { params, headers });

    // Return the data from the external API to the client
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error:', error.message);
    }
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});