const Stripe = require("stripe");
const client = require("../config/db");
const { ObjectId } = require("mongodb");
const stripe = Stripe(process.env.PAYMENT_SECRET_KEY);
const paymentCollection = client.db("bistroNestDb").collection("payments");
const cartCollection = client.db("bistroNestDb").collection("carts");
const menuCollection = client.db("bistroNestDb").collection("menu");
const userCollection = client.db("bistroNestDb").collection("users");

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

const allPayment = async (req, res) => {
  const query = { email: req.params.email };

  if (req.params.email !== req.decoded.email) {
    return res.status(404).send("UnAuthorized Access");
  }
  const result = await paymentCollection.find(query).toArray();
  res.send(result);
};

const adminState = async (req, res) => {
  const users = await userCollection.countDocuments();
  const menuItems = await menuCollection.countDocuments();
  const orders = await paymentCollection.countDocuments();

  //   this is not the best wye
  //   const payments = await paymentCollection.find().toArray();
  //   const revenue = payments.reduce((total, item) => total + item.price, 0);

  const result = await paymentCollection.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
      },
    },
  ]).toArray()
  const revenue=result[0]?.totalRevenue||0
  res.send({
    users,
    menuItems,
    orders,
    revenue,
  });
};

module.exports = {
  stripePaymentIntent,
  paymentHistory,
  allPayment,
  adminState,
};
