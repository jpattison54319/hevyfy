import mongoose from 'mongoose';

const AnimationSchema = new mongoose.Schema({
  name: String,
  spriteSrc: String,
  startFrame: Number,
  frameCount: Number,
  fps: Number,
  columns: Number,
  frameWidth: Number,
  frameHeight: Number,
  scale: Number
}, { _id: false });

const MiniBossSchema = new mongoose.Schema({
    chapter: { type: Number, required: true },
    bossNumber: { type: Number, required: true }, // Unique within chapter
    name: { type: String, required: true },
    requiredSkillTotal: { type: Number, required: true },
    weakness: {type: String, required: false},
    reward: {
      xp: { type: Number, required: false },
      item: { type: String }
    },
    animations: [AnimationSchema] 
  });

export default mongoose.model('MiniBoss', MiniBossSchema);