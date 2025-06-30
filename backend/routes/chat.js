import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
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
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const prompt = `
You are a nutrition assistant. Given the following food description, return a JSON object with calories, protein, carbs, fiber, and fat.

Food: ${message}

Return only a JSON object without explanation.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0,
    });

    // Extract JSON from response text
const rawResponse = response.choices[0].message.content;
const cleaned = rawResponse.replace(/```json|```/g, '').trim();
let parsed;
try {
  parsed = JSON.parse(cleaned);
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

export default router;
