import express from 'express';
const router = express.Router();
import User from '../models/User.js'; // Adjust the import path as necessary
import mongoose from 'mongoose';
import crypto from 'crypto';
const algorithm = 'aes-256-cbc';
import { defineSecret } from "firebase-functions/params";

const ENCRYPTION_SECRET_KEY = defineSecret("ENCRYPTION_SECRET_KEY");

function encrypt(text, key) {
  const iv = crypto.randomBytes(16); // Must be generated per encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encryptedText, key) {
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
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.post("/hevy/saveKey", async (req, res) => {
  const { hevyKey, uid } = req.body;

  console.log('hit webhook api: ', hevyKey);
  const key = Buffer.from(ENCRYPTION_SECRET_KEY.value(), 'base64'); // 32 bytes

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

  const encryptedKey = encrypt(hevyKey,key);

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
      message: "Hevy integration setup successfully!",
      updatedUser: updatedUser});
  } catch (err) {
    console.error("Error saving Hevy key:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
