// routes/auth.js
import express from 'express';
import admin from '../firebaseAdmin.js';
import User from '../models/User.js'; // your Mongoose User model

const router = express.Router();

router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, name, email, picture } = decodedToken;

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        name,
        email,
        displayName: name,
        // you can create pet data here too if needed
        createdAt: new Date()
      });
    }

    res.json(user);
  } catch (err) {
    console.error('Error verifying Firebase token:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;
