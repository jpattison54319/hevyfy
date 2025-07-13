import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import axios from 'axios';  // import axios as a whole
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import userRoutes from './routes/user.js';
import weightLogRoutes from './routes/weightLog.js';
import workoutRoutes from './routes/workout.js';
import mealRoutes from './routes/meal.js';
import routineRoutes from './routes/routine.js';




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
app.use('/api/chatnutrition', chatRoutes);
app.use('/api/weightLogs', weightLogRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/meal', mealRoutes);
app.use('/api/routines', routineRoutes);



const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workout RPG API',
      version: '1.0.0',
      description: 'API documentation for the Hevy RPG App',
    },
    servers: [
      {
        url: 'http://localhost:2025',
      },
    ],
  },
  apis: ['./routes/*.js'], // path to your route files
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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