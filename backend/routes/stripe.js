import express from 'express';
const router = express.Router();
import stripe from "stripe"
(process.env.STRIPE_SECRET_KEY); // set this in Firebase

router.post("/create-checkout-session", async (req, res) => {
  const { priceId, customerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://yourapp.com/success",
      cancel_url: "https://yourapp.com/cancel",
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;