import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Routine from '../models/Routine.js';

router.get('/', async (req, res) => {
  const { uid, communityRoutine } = req.query;

  if (!uid && !communityRoutine) {
    return res.status(400).json({ message: 'Missing required query filters' });
  }

  const filter = {};

  if (uid) filter.userId = uid;
  if (communityRoutine !== undefined) {
    // Cast to Boolean (because all query params are strings)
    filter.communityRoutine = communityRoutine === 'true';
  }

  try {
    const routines = await Routine.find(filter);

    res.status(200).json({
      message: 'Routines successfully retrieved',
      routines
    });
  } catch (err) {
    console.error('Error retrieving routines: ', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/delete/:_id', async (req, res) => {
  const _id = req.params;
if (!_id ) {
  return res.status(400).json({ message: 'Missing required fields' });
}

try{

    const result = await Routine.deleteOne({_id});

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Routine not found or already deleted' });
    }

  res.status(200).json({
      message: 'Routine successfully deleted',
      result
    });
}catch(err){
console.log('Error deleting routine: ', err);
res.status(500).json({message: 'Server Error'});
}

});

router.patch('/update/:_id', async (req, res) => {
  const { _id } = req.params;
  const updateData = req.body;

  if (!_id || !updateData) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const updatedRoutine = await Routine.findByIdAndUpdate(
      _id,
      updateData,
      {
        new: true,       // return the updated document
        runValidators: true, // ensure schema validation
      }
    );

    if (!updatedRoutine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    res.status(200).json({
      message: 'Routine successfully updated',
      routine: updatedRoutine
    });
  } catch (err) {
    console.error('Error updating routine: ', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/copy/:routineId', async (req, res) => {
  const { routineId } = req.params;
  const { userId } = req.body;

  if (!routineId || !userId) {
    return res.status(400).json({ message: 'Missing routineId or userId' });
  }

  try {
    // Fetch the original routine
    const originalRoutine = await Routine.findById(routineId);
    if (!originalRoutine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Create a new routine with the same data, but assign to the new user
    const copiedRoutine = new Routine({
      ...originalRoutine.toObject(),
      _id: undefined, // Let Mongo generate a new _id
      userId,
      communityRoutine: false,
      timestamp: new Date(),
    });

    await copiedRoutine.save();

    res.status(201).json({ message: 'Routine copied successfully', routine: copiedRoutine });
  } catch (err) {
    console.error('Error copying routine: ', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/share/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    const routine = await Routine.findById(_id);

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    const sharedRoutine = new Routine({
      ...routine.toObject(),
      _id: undefined, // Let MongoDB generate a new _id
      userId: 'Community', // Or "community"
      communityRoutine: true,
      timestamp: new Date(),
    });

    await sharedRoutine.save();

    res.status(201).json({
      message: 'Routine successfully shared to community',
      routine: sharedRoutine,
    });

  } catch (err) {
    console.error('Error sharing routine: ', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;