import express from 'express';
import fetch from 'node-fetch'; // or global fetch in Node 18+
import User from '../models/User.js';

const router = express.Router();

function decrypt(encryptedText) {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
  
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
  
    return decrypted.toString('utf8');
  }

router.post('/webhook', async (req, res) => {
    try {
      const { id, payload } = req.body;
  
      if (!payload?.workoutId) {
        return res.status(400).send({ error: 'Missing workoutId' });
      }
  
      const { workoutId } = payload;
  
    console.log('LOOK AT ME: ', payload.workoutId);
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