import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import WeightLog from '../models/WeightLog.js';

router.get('/:uid', async (req, res) => {
    const userId = req.params.uid;
  if (!userId ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try{

      const weightLogs = await WeightLog.find({userId});

    res.status(200).json({
      message: 'Weight logs successfully found',
      weightLogs
    });
}catch(err){
console.log('Error retrieving weight logs: ', err);
res.status(500).json({message: 'Server Error'});
}

});

router.post('/addWeightLog', async (req, res) => {
      console.log('🔥 /addWeightLog hit');

  const { userId, weight, date } = req.body;

  if (!userId || !weight || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try{
  // Create workout log
  const weightLog = new WeightLog({
    userId: userId,
    weight: weight,
    date: date,
  });

      await weightLog.save();

    res.status(200).json({
      message: 'Weight successfully logged',
      weightLog
    });
}catch(err){
console.log('Error logging weight: ', err);
res.status(500).json({message: 'Server Error'});
}

});

export default router;
