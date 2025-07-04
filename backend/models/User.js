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

const QuestSchema = new mongoose.Schema({
  id: String,
  title: String,
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
  },
  rewardXp: Number,
}, { _id: false });

const LoggedMealSchema = new mongoose.Schema({
  id: String,
  description: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fluid_intake_ml: { type: Number, default: 0 },               // new field
  servings_of_fruits_vegetables: { type: Number, default: 0 }, // new field
  currency: Number, // calorie currency equivalent
  timestamp: String,
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
  weeklyProgress: [{
    week: Number,
    weightChange: Number,
  }],
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
  showCalories: Boolean,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: String,
  avatarUrl: String,
  pet: {
  type: PetStatsSchema,
  default: () => ({}), // this triggers defaults inside PetStatsSchema
},
  quests: [QuestSchema],
  meals: {type: [LoggedMealSchema], default: []},
  goal: {
  type: UserGoalSchema,
  default: () => ({}),
},
  bodyStats: {type: UserBodyStatsSchema, default: () => ({}),},
  settings: SettingsSchema,
  lastLogin: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);

// const petStatsSchema = new mongoose.Schema({
//   strength: { type: Number, default: 1 },
//   endurance: { type: Number, default: 1 },
//   speed: { type: Number, default: 1 }
// }, { _id: false });

// const petSchema = new mongoose.Schema({
//   name: { type: String, default: 'Mochi' },
//   species: { type: String, default: 'fox' },
//   mood: { type: String, enum: ['happy', 'neutral', 'sad'], default: 'neutral' },
//   happiness: { type: Number, default: 5, min: 0, max: 10 },
//   xp: { type: Number, default: 0 },
//   level: { type: Number, default: 1 },
//   health: { type: Number, default: 100 },
//   stats: { type: petStatsSchema, default: () => ({}) }
// }, { _id: false });

// const nutritionLogSchema = new mongoose.Schema({
//   date: { type: String, required: true },
//   summary: String,
//   proteinScore: Number,
//   fiberScore: Number,
//   happinessImpact: Number
// }, { _id: false });

// const workoutLogSchema = new mongoose.Schema({
//   date: { type: String, required: true },
//   source: { type: String, enum: ['hevy', 'manual'], default: 'manual' },
//   type: String,
//   xpGained: Number,
//   statChanges: {
//     strength: Number,
//     endurance: Number
//   }
// }, { _id: false });

// const userSchema = new mongoose.Schema({
//   uid: { type: String, required: true, unique: true }, // Firebase UID
//   email: { type: String, required: true, unique: true },
//   displayName: { type: String },

//   pet: { type: petSchema, default: () => ({}) },

//   logs: {
//     nutrition: { type: [nutritionLogSchema], default: [] },
//     workouts: { type: [workoutLogSchema], default: [] }
//   },

//   settings: {
//     showCalories: { type: Boolean, default: false },
//     notificationsEnabled: { type: Boolean, default: true }
//   },

//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model('User', userSchema);