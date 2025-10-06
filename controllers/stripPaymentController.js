const client = require("../config/db");
const strip = require("strip")(process.env.PAYMENT_SECRET_KEY);

export const stripPaymentIntent = async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(100 * price);

  const paymentIntent = await strip.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({ clientSecret: paymentIntent.client_secret });
};
