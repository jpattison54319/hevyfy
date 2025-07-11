import mongoose from 'mongoose';

const WeightLogSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true }
});

export default mongoose.model('WeightLog', WeightLogSchema);