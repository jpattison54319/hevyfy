/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";

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

const isLocal = !process.env.K_SERVICE;
if (isLocal) {
  const dotenv = await import("dotenv");
  dotenv.config();
}
// mongodb+srv://jpattison54319:<db_password>@cluster0.x3iwmzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const app = express();
const PORT = process.env.PORT;
const MONGO_USER = defineSecret("MONGO_USER");
const MONGO_PASS = defineSecret("MONGO_PASS");
const MONGO_CLUSTER = defineSecret("MONGO_CLUSTER");
const MONGO_DB = defineSecret("MONGO_DB");
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASS;
const cluster = process.env.MONGO_CLUSTER;
const db = process.env.MONGO_DB;
const uri = `mongodb+srv://${user}:${pass}@${cluster}/${db}?retryWrites=true&w=majority`;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(uri) {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then(mongoose => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

//console.log('Connecting to MongoDB Atlas with URI:', uri);
// mongoose.connect(uri)
// .then(() => {
//   console.log('✅ Connected to MongoDB Atlas');
//   //app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// }).catch((err) => {
//   console.error('❌ Failed to connect to MongoDB:', err);
// });
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

app.use(cors({ origin: true }));  // enable CORS for all origins
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chatnutrition', chatRoutes);
app.use('/api/weightLogs', weightLogRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/meal', mealRoutes);
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
        url: 'https://api-wosc6bjdaa-uc.a.run.app/', // ✅ Firebase Cloud Functions base URL
        description: 'Deployed Firebase API',
      },
      {
        url: 'http://localhost:2025', // ✅ Local testing
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // path to your route files
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export const api = onRequest(
  {
    secrets: [MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB, OPENAI_API_KEY],
  },
  async (req, res) => {
   const user = await MONGO_USER.value();
    const pass = await MONGO_PASS.value();
    const cluster = await MONGO_CLUSTER.value();
    const db = await MONGO_DB.value();

    const uri = `mongodb+srv://${user}:${pass}@${cluster}/${db}?retryWrites=true&w=majority`;
    console.log('Connecting to MongoDB Atlas with URI:', uri);
    await connectToDatabase(uri);

    app(req, res);
  }
); // Export the Express app as a Firebase function
// //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------