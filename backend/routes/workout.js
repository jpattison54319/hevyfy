import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import OpenAI from "openai";
import Routine from '../models/Routine.js';
import Workout from '../models/Workout.js';
import User from '../models/User.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function xpNeededForLevel(level) {
  const baseXp = 1000;       // XP needed to reach level 2
  const growthFactor = 1.5;  // XP multiplies by this factor each level
  return Math.floor(baseXp * Math.pow(growthFactor, level - 1));
}

router.get('/:uid/workouts', async (req, res) => {
    const userId = req.params.uid;
      const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;
  if (!userId ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try{

      const workouts = await Workout.find({ userId })
      .sort({ timestamp: -1 }) // Most recent first
      .skip(offset)
      .limit(limit);

          const totalWorkouts = await Workout.countDocuments({ userId });


    res.status(200).json({
      message: 'Workouts successfully found',
      workouts,
      totalWorkouts,
      offset,
      limit
    });
}catch(err){
console.log('Error retrieving workout logs: ', err);
res.status(500).json({message: 'Server Error'});
}

});

router.post('/logWorkout', async (req, res) => {
  const {
    userId,
    logType,
    timestamp,
    rpe,
    notes,
    workoutXp,
    workoutType,
    cardioMode,
    duration,
    distance,
    routineId,
    routineDay,
    performedExercises
  } = req.body;

 if (!userId || !logType) {
    return res.status(400).json({ message: 'Missing required fields: userId or logType' });
  }
  let user;
  let previousLevel;

     try {
        console.log('userId: ', userId);
        // Fetch the user first to update total XP & level
        user = await User.findOne({ uid: userId });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Update user's total XP by adding workout XP
        user.pet.xp = (user.pet.xp || 0) + (workoutXp.pet || 0);
        user.pet.strength = (user.pet.strength || 0) + (workoutXp.strength || 0);
        user.pet.agility = (user.pet.agility || 0) + (workoutXp.agility || 0);
    
    
        // Check if user.level exists, else default to 1
        user.pet.level = user.pet.level || 1;
        previousLevel = user.pet.level || 1;
    
        // Loop level-ups if multiple levels gained at once
        while (user.pet.xp >= xpNeededForLevel(user.pet.level)) {
      user.pet.xp -= xpNeededForLevel(user.pet.level);
      user.pet.level += 1;
    }
}catch(err){
    console.error(err);
        res.status(500).json({ message: 'Server Error' });

}

 try {
    const log = new Workout({
      userId,
      logType,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      rpe,
      notes,
      workoutXp,
      workoutType,

      // manual fields
      cardioMode: logType === 'manual' ? cardioMode : undefined,
      duration: logType === 'manual' ? duration : undefined,
      distance: logType === 'manual' ? distance : undefined,

      // routine fields
      routineId: logType === 'routine' ? routineId : undefined,
      routineDay: logType === 'routine' ? routineDay : undefined,
      performedExercises: logType === 'routine' ? performedExercises : undefined
    });


      await log.save();
      const leveledUp = user.pet.level > previousLevel;


     res.status(200).json({
      message: 'Workout logged and XP updated successfully',
      workoutLog: log,
      updatedUser: user,
      levelUp: leveledUp,
    });
}catch(err){
 console.error('Error logging workout:', err);
    res.status(500).json({ message: 'Server Error' });
}

});

/**
 * @swagger
 * /routine/createRoutine:
 *   post:
 *     summary: Generate a workout routine based on user input
 *     tags:
 *       - Routine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: >
 *                   Natural language description of user’s workout goals, preferences, equipment, experience, and any considerations.
 *             required:
 *               - message
 *     responses:
 *       200:
 *         description: The generated workout routine as a structured JSON object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routineName:
 *                   type: string
 *                 experienceLevel:
 *                   type: string
 *                 goal:
 *                   type: string
 *                 sport:
 *                   type: string
 *                 physicalConsiderations:
 *                   type: string
 *                 daysPerWeek:
 *                   type: string
 *                 weeklySchedule:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dayName:
 *                         type: string
 *                       exercises:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             exercise:
 *                               type: string
 *                             repRange:
 *                               type: string
 *                             sets:
 *                               type: string
 *                             howToPerform:
 *                               type: string
 *       400:
 *         description: Bad request, missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 suggestion:
 *                   type: string
 *       500:
 *         description: Internal server error (e.g. OpenAI request failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/routine/createRoutine", async (req, res) => {
   const {
    goal,
    sport,
    experience,
    days,
    equipment,
    include,
    exclude,
    considerations,
    sessionDurationMinutes,
    petCoach,
    userId
  } = req.body;

  const message = {
    goal,
    sport,
    experience,
    days,
    equipment,
    include,
    exclude,
    sessionDurationMinutes,
    considerations,
    petCoach,
  };
  console.log('Received message:', message); // Debug log to check the incoming message
  if (!message) return res.status(400).json({ error: "No message provided" });

try {
   const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an evidence-based certified strength & conditioning coach and exercise scientist.

The user is requesting a personalized weekly training routine. Based on the inputs provided:
- Tailor the routine to match their **goal** (e.g., Max Muscle, Strength, Cardio, or Sport Specific).
- If a **sport** is provided, include relevant movements or conditioning tailored to that sport.
- Respect their **experience level** (e.g., beginner, intermediate, advanced) and explain any necessary modifications.
- Use **only equipment** that matches the user's available equipment. Use the equipment from the users list that best meets their goal, ignore the rest.
- If there are **exercises to include** or **exclude**, follow them precisely.
- The routine should span exactly the number of days they specified.
- If a petCoach is provided and not empty (e.g., Fenrir, Primordial Tyrant), tailor the workout to reflect the 
petCoachs mythical characteristics, emphasizing training styles, exercise themes, or intensities that align with the pets persona while still meeting the users goal, 
experience level, equipment, and physical considerations. For example, Fenrir might focus on explosive strength.
-If exercise is meant to be slow/controlled say that in howTo. If its meant to be explosive include that in howTo.
- If there are physical considerations (e.g., bad knees, low back pain), **this takes top priority over all goals or pet coach modifications.**
- If the user has a bad lower back:
    - Avoid exercises that require unsupported spinal loading (e.g., Romanian deadlifts, bent-over rows, standing overhead press, barbell squats).
    - Prefer machines (e.g., leg press, chest-supported row, cable overhead press) and supported positions.

Respond in valid JSON format using this exact structure:
{
  "routineName": string,
  "experienceLevel": string,
  "goal": string,
  "petCoachAffects": string,
  "sport": string | null,
  "physicalConsiderations": string | null,
  "daysPerWeek": number,
  "weeklySchedule": [
    {
      "dayName": string,
      "exercises": [
        {
          "exercise": string,
          "repRange": string,
          "sets": string,
          "howToPerform": string
        }
      ]
    }
  ]
}
`
        },
        {
          role: "user",
          content: JSON.stringify(message)
        }
      ],
      max_completion_tokens: 2500,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    console.log('OpenAI response:', response); // Debug log to check the OpenAI response

    // Extract JSON from response text
const workoutRoutine = JSON.parse(response.choices[0].message.content);

const savedRoutine = await Routine.create({
  ...workoutRoutine,
  userId,
});
console.log(workoutRoutine);

res.json(savedRoutine);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

export default router;
