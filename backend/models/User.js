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
  mealAffects: {
    armorIncrease: { type: Number, default: 0 },
    speedIncrease: { type: Number, default: 0 },
    intelligenceIncrease: { type: Number, default: 0 },
    defenseIncrease: { type: Number, default: 0 },
  },
}, { _id: false });

const WeightLog = new mongoose.Schema({
  date: {type: Date, default: Date.now},
  weight: {type: Number, required: true},
  }, { _id: false });


const UserBodyStatsSchema = new mongoose.Schema({
  weight: {type: Number, default: 0},
  weightLogs: [WeightLog],
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

const LoggedWorkoutSchema = new mongoose.Schema({
  id: String,
   workoutType: String,
  cardioMode: String, //duration or distance
  duration: Number, //mins
  distance: Number, //miles
  rpe: Number,
  notes: String,
  workoutXp: {
   strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    pet: { type: Number, default: 0 },
  },
  timestamp: String,
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
  workouts: {type: [LoggedWorkoutSchema], default: []},
  goal: {
  type: UserGoalSchema,
  default: () => ({}),
},
  bodyStats: {type: UserBodyStatsSchema, default: () => ({}),},
  settings: SettingsSchema,
  lastLogin: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);