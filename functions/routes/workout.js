import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Workout from '../models/Workout.js';
import User from '../models/User.js';

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

export default router;
