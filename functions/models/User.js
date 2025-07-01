import mongoose from 'mongoose';
const petStatsSchema = new mongoose.Schema({
  strength: { type: Number, default: 1 },
  endurance: { type: Number, default: 1 },
  speed: { type: Number, default: 1 }
}, { _id: false });

const petSchema = new mongoose.Schema({
  name: { type: String, default: 'Mochi' },
  species: { type: String, default: 'fox' },
  mood: { type: String, enum: ['happy', 'neutral', 'sad'], default: 'neutral' },
  happiness: { type: Number, default: 5, min: 0, max: 10 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  health: { type: Number, default: 100 },
  stats: { type: petStatsSchema, default: () => ({}) }
}, { _id: false });

const nutritionLogSchema = new mongoose.Schema({
  date: { type: String, required: true },
  summary: String,
  proteinScore: Number,
  fiberScore: Number,
  happinessImpact: Number
}, { _id: false });

const workoutLogSchema = new mongoose.Schema({
  date: { type: String, required: true },
  source: { type: String, enum: ['hevy', 'manual'], default: 'manual' },
  type: String,
  xpGained: Number,
  statChanges: {
    strength: Number,
    endurance: Number
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  displayName: { type: String },

  pet: { type: petSchema, default: () => ({}) },

  logs: {
    nutrition: { type: [nutritionLogSchema], default: [] },
    workouts: { type: [workoutLogSchema], default: [] }
  },

  settings: {
    showCalories: { type: Boolean, default: false },
    notificationsEnabled: { type: Boolean, default: true }
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);