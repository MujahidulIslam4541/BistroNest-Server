const Stripe = require("stripe");
const client = require("../config/db");
const { ObjectId } = require("mongodb");
const stripe = Stripe(process.env.PAYMENT_SECRET_KEY);
const paymentCollection = client.db("bistroNestDb").collection("payments");
const cartCollection = client.db("bistroNestDb").collection("carts");

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

const paymentHistory = async (req, res) => {
  const payment = req.body;
  const paymentResult = await paymentCollection.insertOne(payment);
  const query = {
    _id: {
      $in: payment.cartIds.map((id) => new ObjectId(id)),
    },
  };
  const deleteResult = await cartCollection.deleteMany(query);
  res.send({ paymentResult, deleteResult });
};

module.exports = { stripePaymentIntent, paymentHistory };
