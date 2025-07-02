import express from 'express';
const router = express.Router();
import User from '../models/User.js'; // Adjust the import path as necessary


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
      { new: true, runValidators: true, overwrite: true }
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

export default router;
