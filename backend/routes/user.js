import express from 'express';
const router = express.Router();
import User from '../models/User.js'; // Adjust the import path as necessary
import mongoose from 'mongoose';
import crypto from 'crypto';
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'base64'); // 32 bytes


function encrypt(text) {
  const iv = crypto.randomBytes(16); // Must be generated per encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encryptedText) {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

export function xpNeededForLevel(level) {
  const baseXp = 1000;       // XP needed to reach level 2
  const growthFactor = 1.5;  // XP multiplies by this factor each level
  return Math.floor(baseXp * Math.pow(growthFactor, level - 1));
}


/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Fetch user by UID
 *     description: Fetches a user by their unique identifier (UID) from the database.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to fetch.
 *     responses:
 *       200:
 *         description: User object retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: string
 *                   description: The user's unique identifier
 *                 email:
 *                   type: string
 *                   description: The user's email address
 *                 goal:
 *                   type: string
 *                   nullable: true
 *                   description: The user's goal (if set)
 *               example:
 *                 uid: "abc123"
 *                 email: "user@example.com"
 *                 goal: "Learn coding"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Failed to fetch user"
 */
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const users = await User.findOne({uid: uid});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users: ', err });
  }
});

router.post('/create', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'User creation failed' });
  }
});

router.post('/update', async (req, res) => {
  console.log('Update user request body:', req.body);
  try {
    const { _id, ...updateData } = req.body;
    
    if (!_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = await User.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true}
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      console.error(err);
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    console.error(err);

    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.post('/:uid/addWorkout', async (req, res) => {
  const { uid } = req.params;
  const { workoutType, cardioMode, duration, distance, rpe, notes, workoutXp } = req.body;

  if (!workoutType || !cardioMode || rpe === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Create workout log
  const workoutLog = {
    id: new mongoose.Types.ObjectId().toString(),
    workoutType,
    cardioMode,
    duration: duration ?? 0,
    distance: distance ?? 0,
    rpe,
    notes: notes ?? '',
    workoutXp,
    timestamp: new Date().toISOString(),
  };

  try {
    // Fetch the user first to update total XP & level
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's total XP by adding workout XP
    user.pet.xp = (user.pet.xp || 0) + (workoutXp.pet || 0);
    user.pet.strength = (user.pet.strength || 0) + (workoutXp.strength || 0);
    user.pet.agility = (user.pet.agility || 0) + (workoutXp.agility || 0);


    // Check if user.level exists, else default to 1
    user.pet.level = user.pet.level || 1;
    const previousLevel = user.pet.level || 1;

    // Loop level-ups if multiple levels gained at once
    while (user.pet.xp >= xpNeededForLevel(user.pet.level)) {
  user.pet.xp -= xpNeededForLevel(user.pet.level);
  user.pet.level += 1;
}

    // Push new workout to workouts array
    user.workouts.push(workoutLog);

    await user.save();
    const leveledUp = user.pet.level > previousLevel;

    res.status(200).json({
      message: 'Workout logged and XP updated successfully',
      workoutLog,
      updatedUser: user,
      levelUp: leveledUp,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:userId/meals', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Find user and populate meals
    const user = await User.findOne({ uid: userId }).select('meals');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Sort meals by timestamp (newest first) and apply pagination
    const sortedMeals = user.meals
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(offset, offset + parseInt(limit));

    res.json({
      meals: sortedMeals,
      total: user.meals.length,
      offset: parseInt(offset),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});


router.post("/hevy/saveKey", async (req, res) => {
  const { hevyKey, uid } = req.body;

  console.log('hit webhook api: ', hevyKey);

  if (!uid || !hevyKey) {
    return res.status(400).json({ message: "Missing user ID (uid) or key!" });
  }

  const response = await fetch('https://api.hevyapp.com/v1/webhook-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': `${hevyKey}`,
        },
        body: JSON.stringify({
          authToken: `Bearer ${uid}`,
          url: `https://api-wosc6bjdaa-uc.a.run.app/api/hevy/webhook`, // your public webhook handler URL
        }),
      });
      console.log('hevy response: ', response);

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).send({ error });
      }

      console.log('hevy response: ', response);

  const encryptedKey = encrypt(hevyKey);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid },                // Match by UID field
      { hevyKey: encryptedKey },       // Set hevyKey
      { new: true }           // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({
      message: "Hevy integration setup successfully!"});
  } catch (err) {
    console.error("Error saving Hevy key:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
