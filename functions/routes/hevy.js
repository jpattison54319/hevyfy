import express from 'express';
import fetch from 'node-fetch'; // or global fetch in Node 18+
import User from '../models/User.js';
import HevyWorkout from '../models/HevyWorkout.js';
const algorithm = 'aes-256-cbc';
import { defineSecret } from "firebase-functions/params";
import crypto from 'crypto';

const router = express.Router();
const ENCRYPTION_SECRET_KEY = defineSecret("ENCRYPTION_SECRET_KEY");

export function xpNeededForLevel(level) {
  const baseXp = 1000;       // XP needed to reach level 2
  const growthFactor = 1.5;  // XP multiplies by this factor each level
  return Math.floor(baseXp * Math.pow(growthFactor, level - 1));
}

function decrypt(encryptedText, key) {
  if (!encryptedText || typeof encryptedText !== 'string') {
    throw new Error('Encrypted text is missing or not a string');
  }

  const [ivHex, encryptedHex] = encryptedText.split(':');
  if (!ivHex || !encryptedHex) {
    throw new Error('Encrypted text format is invalid');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

function calculateWorkoutXp(hevyWorkout, user) {
  let rawStrength = 0;
  let rawAgility = 0;

  for (const ex of hevyWorkout.exercises || []) {
    for (const set of ex.sets || []) {
      const weight = set.weightKg ?? user.bodyStats?.weight ?? 0;

      if (set.reps) rawStrength += set.reps * weight;
      if (set.durationSeconds) rawAgility += set.durationSeconds;
      if (set.distanceMeters) rawAgility += set.distanceMeters;
    }
  }

  const strength = Math.round(rawStrength * 0.01);     // low contribution
  const agility = Math.round(rawAgility * 0.05);       // low contribution
  const pet = Math.round((rawStrength + rawAgility) * 0.3); // big reward

  return {
    strength: isNaN(strength) ? 0 : strength,
    agility: isNaN(agility) ? 0 : agility,
    pet: isNaN(pet) ? 0 : pet,
  };
}

// function decrypt(encryptedText) {
//     const [ivHex, encryptedHex] = encryptedText.split(':');
//     const iv = Buffer.from(ivHex, 'hex');
//     const encrypted = Buffer.from(encryptedHex, 'hex');
  
//     const decipher = crypto.createDecipheriv(algorithm, key, iv);
//     let decrypted = decipher.update(encrypted);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
  
//     return decrypted.toString('utf8');
//   }

router.post('/webhook', async (req, res) => {
    try {
      const { id, payload } = req.body;
  
      if (!payload?.workoutId) {
        return res.status(400).send({ error: 'Missing workoutId' });
      }  
    const key = Buffer.from(ENCRYPTION_SECRET_KEY.value(), 'base64'); // 32 bytes

    console.log('📦 Webhook Received');
    console.log('Workout ID:',  payload.workoutId);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const authHeader = req.headers.authorization || '';
    const uid = authHeader.replace('Bearer ', '').trim();
      let user;
    user = await User.findOne({uid: uid});
    if (!user) return res.status(404).send({ error: 'User not found' });
    console.log('hevyKey before decrypt: ', user.hevyKey);

    const url = `https://api.hevyapp.com/v1/workouts/${payload.workoutId}`;

    const decryptedKey = decrypt(user.hevyKey,key);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-key': decryptedKey,
      },
    });

    const data = await response.json(); 

    let previousLevel = user.pet.level || 1;

    const xp = calculateWorkoutXp(data, user);
    xp.strength = isNaN(xp.strength) ? 0 : xp.strength;
    xp.agility = isNaN(xp.agility) ? 0 : xp.agility;
    xp.pet = isNaN(xp.pet) ? 0 : xp.pet;

    user.pet.xp = (user.pet.xp || 0) + xp.pet;
user.pet.strength = (user.pet.strength || 0) + xp.strength;
user.pet.agility = (user.pet.agility || 0) + xp.agility;


while (user.pet.xp >= xpNeededForLevel(user.pet.level)) {
  user.pet.xp -= xpNeededForLevel(user.pet.level);
  user.pet.level += 1;
}

console.log('Saving Updated User from hevy WOrkout!');


await user.save();


const hevyWorkout = new HevyWorkout({
  userId: user._id,
  hevyWorkoutId: data.id,
  title: data.title,
  description: data.description,
  startTime: new Date(data.start_time),
  endTime: new Date(data.end_time),
  createdAt: new Date(data.created_at),
  updatedAt: new Date(data.updated_at),
  exercises: data.exercises.map(ex => ({
    index: ex.index,
    title: ex.title,
    notes: ex.notes,
    exerciseTemplateId: ex.exercise_template_id,
    supersetId: ex.superset_id,
    sets: ex.sets.map(set => ({
      index: set.index,
      type: set.type,
      weightKg: set.weight_kg,
      reps: set.reps,
      distanceMeters: set.distance_meters,
      durationSeconds: set.duration_seconds,
      rpe: set.rpe,
      customMetric: set.custom_metric,
    }))
  })),
  petAffects: {
    strength: xp.strength,
    agility: xp.agility,
    pet: xp.pet,
    leveledUp: user.pet.level > previousLevel
  },
  raw: data
});

  console.log('Saving Hevy WOrkout!');
    
    await hevyWorkout.save();

    //   const user = await User.findOne({ hevyWorkoutIds: workoutId });
  
    //   if (user) {
    //     const petXP = 5; // or calculate from full workout if fetched
    //     await usersCollection.updateOne(
    //       { uid: user.uid },
    //       {
    //         $inc: { 'petStats.strength': petXP },
    //         $push: { workoutLog: { workoutId, timestamp: new Date() } },
    //         $set: { showHevySplash: true },
    //       }
    //     );
    //   } else {
    //     console.warn('Workout received but no matching user found');
    //   }
  
      // Respond within 5 seconds!
      res.status(200).send({ received: true });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Internal error' });
    }
  });

export default router;