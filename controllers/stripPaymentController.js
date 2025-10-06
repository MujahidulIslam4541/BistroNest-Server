const Stripe = require("stripe");
const stripe = Stripe(process.env.PAYMENT_SECRET_KEY);

const stripePaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = Math.round(price * 100); // Convert USD → cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).send({ error: error.message });
  }
};

module.exports = { stripePaymentIntent };
