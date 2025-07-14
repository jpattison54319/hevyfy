import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import User from '../models/User.js';
import Meal from "../models/Meal.js";
dotenv.config();
const router = express.Router();

router.get("/:uid/meals", async (req, res) => {
  const { uid } = req.params;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  if (!uid) {
    return res.status(400).json({ message: "Missing user ID (uid)" });
  }

  try {
    const meals = await Meal.find({ userId: uid })
      .sort({ timestamp: -1 }) // latest meals first
      .skip(offset)
      .limit(limit);

    const totalMeals = await Meal.countDocuments({ userId: uid });

    res.json({
      meals: meals,
      total: totalMeals,
      offset: parseInt(offset),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error("Error retrieving meals:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/addMeal', async (req, res) => {
  const { userId, description, calories, protein, carbs, fat, fiber,  servings_of_fruits_vegetables, fluid_intake_ml, fullTimeStamp, userTimeZone } = req.body;
  console.log('Received meal data:', req.body); // Debug log to check the incoming data
  if (!userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const dateObj = new Date(fullTimeStamp);

const localDay = new Intl.DateTimeFormat("sv-SE", { timeZone: userTimeZone}).format(dateObj); // "YYYY-MM-DD"


  const currency = Math.round(calories / 100);// Convert calories to currency (1 currency = 100 calories)
  //const today = new Date().toLocaleDateString("sv-SE"); // Format: YYYY-MM-DD
const armorRaw = (protein ?? 0) * 0.1;
const defenseRaw = (fiber ?? 0) * 0.33;
const speedRaw = (fluid_intake_ml ?? 0) * 0.0025;
const intelligenceRaw = (servings_of_fruits_vegetables ?? 0) * 2;

const mealAffects = {
  armorIncrease: protein > 0 ? Math.max(Math.round(armorRaw), 1) : 0,
  defenseIncrease: fiber > 0 ? Math.max(Math.round(defenseRaw), 1) : 0,
  speedIncrease: fluid_intake_ml > 0 ? Math.max(Math.floor(speedRaw), 1) : 0,
  intelligenceIncrease:
    servings_of_fruits_vegetables > 0
      ? Math.max(Math.round(intelligenceRaw), 1)
      : 0,
};


  const mealLog = new Meal({
    id: new mongoose.Types.ObjectId().toString(),
    userId,
    description,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    servings_of_fruits_vegetables, 
    fluid_intake_ml,
    currency,
    timestamp: dateObj,
    mealAffects,
  });

  console.log(mealLog); // Debug log to check the meal data structure

  try {
    await mealLog.save();


    const updatedUser = await User.findOneAndUpdate(
      { uid: userId },
    {$inc: {
      [`goal.dailyCurrencyUsed.${localDay}`]: currency,
      'pet.armor': mealAffects.armorIncrease,
      'pet.speed': mealAffects.speedIncrease,
      'pet.intelligence': mealAffects.intelligenceIncrease,
      'pet.defense': mealAffects.defenseIncrease,
      // You could also increment XP here if meals grant XP:
      // 'pet.xp': xpEarnedFromMeal
    },
   },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    console.log('Updated user:', updatedUser); // Debug log to check the updated user data

     res.status(200).json({
      message: 'Meal added successfully',
      mealAffects: {
    ...mealAffects,
    currency: mealLog.currency,
    description: mealLog.description,
  },
      updatedUser, // <-- return updated user object here
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;