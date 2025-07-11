import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  description: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fluid_intake_ml: { type: Number, default: 0 },
  servings_of_fruits_vegetables: { type: Number, default: 0 },
  currency: Number,
  timestamp: { type: Date, default: Date.now },

  mealAffects: {
    armorIncrease: { type: Number, default: 0 },
    speedIncrease: { type: Number, default: 0 },
    intelligenceIncrease: { type: Number, default: 0 },
    defenseIncrease: { type: Number, default: 0 },
  }
});

export default mongoose.model('Meal', MealSchema);