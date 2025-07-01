import express from 'express';
const router = express.Router();
import User from '../models/User.js'; // Adjust the import path as necessary

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
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
export default router;
