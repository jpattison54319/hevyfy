import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import User from '../models/User.js';
dotenv.config();
const router = express.Router();



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



/**
 * @swagger
 * /api/chatnutrition:
 *   post:
 *     summary: sends a food description to OpenAI and returns nutrition data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: string containing JSON with nutrition data
 *       401:
 *         description: Unauthorized
 */
router.post("/", async (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message); // Debug log to check the incoming message
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const prompt = 
    `You are a nutrition assistant. Given the following food description, return a JSON object with calories, 
    protein, carbs, fiber, fat, servings of fruits/vegetables, and fluid intake in ml.
    Food: ${message}

Return only a JSON object without explanation.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0,
    });
    console.log('OpenAI response:', response); // Debug log to check the OpenAI response

    // Extract JSON from response text
const rawResponse = response.choices[0].message.content;
const cleaned = rawResponse.replace(/```json|```/g, '').trim();
let parsed;
try {
  parsed = JSON.parse(cleaned);
  console.log('Parsed JSON:', parsed); // Debug log to check the parsed JSON
} catch (err) {
  console.error("Failed to parse response:", err);
  parsed = null;
}
    // Try parsing JSON


    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

/**
 * @swagger
 * /api/chatnutrition/{uid}/addMeal:
 *   post:
 *     summary: Adds a meal to the user's meal log
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: The unique identifier of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               calories:
 *                 type: number
 *               protein:
 *                 type: number
 *               carbs:
 *                 type: number
 *               fat:
 *                 type: number
 *               servings_of_fruits_vegetables:
 *                 type: number
 *               fluid_intake_ml:
 *                 type: number
 *             required:
 *               - description
 *               - calories
 *     responses:
 *       200:
 *         description: Meal added successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/:uid/addMeal', async (req, res) => {
  const { uid } = req.params;
  const { description, calories, protein, carbs, fat, fiber,  servings_of_fruits_vegetables, fluid_intake_ml } = req.body;
  console.log('Received meal data:', req.body); // Debug log to check the incoming data
  if (!description || !calories) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const currency = Math.round(calories / 100);// Convert calories to currency (1 currency = 100 calories)
  const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

  const mealLog = {
    id: new mongoose.Types.ObjectId().toString(),
    description,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    servings_of_fruits_vegetables, 
    fluid_intake_ml,
    currency,
    timestamp: new Date().toISOString(),
  };

  console.log(mealLog); // Debug log to check the meal data structure
      const mealAffects = {
      currency: mealLog.currency ?? 0,
      description: mealLog.description ?? '',
      armorIncrease: Math.round(mealLog.protein * 0.1) ?? 0,
      speedIncrease: Math.round(mealLog.fluid_intake_ml * 0.01) ?? 0,
      intelligenceIncrease: mealLog.servings_of_fruits_vegetables ?? 0, 
      defenseIncrease: Math.round(mealLog.fiber * 0.5) ?? 0,
    }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { $push: { meals: mealLog },
    $inc: {
      [`goal.dailyCurrencyUsed.${today}`]: currency,
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
      mealAffects,
      updatedUser, // <-- return updated user object here
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
