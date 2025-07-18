import mongoose from 'mongoose';

const PetStatsSchema = new mongoose.Schema({
   name: { type: String, default: 'Fluffy' },
  currentPet: { type: String, default: 'puppy' },
 level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  strength: { type: Number, default: 0 },
  defense: { type: Number, default: 0 },
  agility: { type: Number, default: 0 },
  intelligence: { type: Number, default: 0 },
  armor: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  happiness: { type: Number, default: 5 }
}, { _id: false });


const UserBodyStatsSchema = new mongoose.Schema({
  weight: {type: Number, default: 0},
  height: {type: Number, default: 0},
  sex: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
  },
  age: {type: Number, default: 0},
  tdee: {type: Number, default: 0},
  bmr: {type: Number, default: 0},
}, { _id: false });

const UserGoalSchema = new mongoose.Schema({
  goalType: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance'],
    default: 'maintenance',
  },
  dailyCalorieGoal: Number,
  dailyCurrencyTotal: Number,
   dailyCurrencyUsed: {
    type: Map,
    of: Number,
    default: () => ({}), // ensure default so Mongo doesn't require init
  },
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
  showCalories: Boolean,
}, { _id: false });

const RoutineSchema = new mongoose.Schema({
  routineId: { type: String, required: true },
  routineName: String,
  routineGoal: String, // 'strength', 'endurance', etc.
  sport: String,
  daysPerWeek: Number,
  weeklySchedule: [{
    day: String, // 'Monday', 'Day 1', etc.
    exercises: [{
      name: String,
      howTo: String,
      sets: Number,
      repRange: String
    }]
  }]
}, { _id: false });

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: String,
  avatarUrl: String,
  routine: { type: RoutineSchema, default: null }, // only one routine per user
  pet: {
    type: PetStatsSchema,
    default: () => ({}),
  },

  goal: {
    type: UserGoalSchema,
    default: () => ({}),
  },
  currentChapter: { type: Number, default: 1 },
  currentBossNumber: { type: Number, default: 1 },
  defeatedBosses: {
    type: [{ chapter: Number, bossNumber: Number }],
    default: [],
  },
  bodyStats: {
    type: UserBodyStatsSchema,
    default: () => ({}),
  },
  hevyKey: {type: String, default: ''},
  settings: SettingsSchema,
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);