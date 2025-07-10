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

const validationSystemMessage = {
  role: "system",
  content: `Determine if the user's message describes a food item or meal that can be nutritionally analyzed and is realistic for a human.

Respond with only "yes" or "no" - nothing else.`
};

// Validation function - OUTSIDE the router
const validateMealInput = async (userMessage) => {
  try {
    const validationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        validationSystemMessage,
        { role: "user", content: userMessage }
      ],
      max_tokens: 10,
      temperature: 0
      // No need for response_format with simple yes/no
    });

    const response = validationResponse.choices[0].message.content.trim().toLowerCase();
    
    if (response === "no") {
      return {
        success: false,
        error: "Invalid food input",
        suggestion: "Please enter a valid meal"
      };
    }

    return { success: true };
    
  } catch (error) {
    console.error('Validation error:', error);
    return {
      success: false,
      error: "Unable to validate input",
      suggestion: "Please try again with a food description"
    };
  }
}



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
  
      const validation = await validateMealInput(message);

        if (!validation.success) {
      return res.status(400).json({
        error: validation.error,
        suggestion: validation.suggestion
      });
    }



try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are a nutrition assistant. Analyze food descriptions and return nutritional information as JSON.

Return JSON with this exact structure:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fiber": number,
  "fat": number,
  "servings_of_fruits_vegetables": number,
  "fluid_intake_ml": number
}

Provide your best estimates based on typical nutritional values for the described food.`
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      max_tokens: 200,
      temperature: 0,
      response_format: { type: "json_object" }
    });
    console.log('OpenAI response:', response); // Debug log to check the OpenAI response

    // Extract JSON from response text
const nutritionData = JSON.parse(response.choices[0].message.content);


    res.json(nutritionData);
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
  if (description === null || calories === null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const currency = Math.round(calories / 100);// Convert calories to currency (1 currency = 100 calories)
  const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

const mealAffects = {
  armorIncrease: Math.round((protein ?? 0) * 0.1),
  speedIncrease: Math.round((fluid_intake_ml ?? 0) * 0.01),
  intelligenceIncrease: servings_of_fruits_vegetables ?? 0,
  defenseIncrease: Math.round((fiber ?? 0) * 0.5),
};


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
    mealAffects,
  };

  console.log(mealLog); // Debug log to check the meal data structure

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
