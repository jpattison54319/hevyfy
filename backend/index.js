import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import axios from 'axios';  // import axios as a whole
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

import userRoutes from './routes/user.js';
// mongodb+srv://jpattison54319:<db_password>@cluster0.x3iwmzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const app = express();
const PORT = process.env.PORT || 2025;
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

console.log('Connecting to MongoDB Atlas with URI:', uri);

mongoose.connect(uri)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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