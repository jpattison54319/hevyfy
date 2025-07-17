import mongoose, { Schema, Document } from 'mongoose';

const MiniBossSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, unique: true },
  requiredSkillTotal: { type: Number, required: true },
  reward: {
    xp: { type: Number, required: true },
    item: { type: String, required: false },
  },
});

export default mongoose.model<MiniBoss>('MiniBoss', MiniBossSchema);