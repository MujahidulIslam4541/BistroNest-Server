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

// const allPayment = async (req, res) => {
//   try {
//     const email = req.decoded.email;
//     const user = await userCollection.findOne({ email: email });

//     let query = {};
//     if (user?.role === "admin") {
//       query = {};
//     } else {
//       query = { email: email };
//     }

//     const result = await paymentCollection.find(query).sort({ _id: -1 }).toArray();
//     res.send(result);
//   } catch (error) {
//     console.error("Error fetching payments:", error);
//     res.status(500).send({ message: "Failed to load payments" });
//   }
// };

const allPayment = async (req, res) => {
  try {
    const email = req.decoded.email;
    const user = await userCollection.findOne({ email: email });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (user?.role === "admin") {
      query = {};
    } else {
      query = { email: email };
    }

    const result = await paymentCollection.find(query).sort({ _id: -1 }).skip(skip).limit(limit).toArray();

    const total = await paymentCollection.countDocuments(query);

    res.send({
      success: true,
      data: {
        result,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).send({ message: "Failed to load payments" });
  }
};

const adminState = async (req, res) => {
  const users = await userCollection.countDocuments();
  const menuItems = await menuCollection.countDocuments();
  const orders = await paymentCollection.countDocuments();

  //   this is not the best wye
  //   const payments = await paymentCollection.find().toArray();
  //   const revenue = payments.reduce((total, item) => total + item.price, 0);

  const result = await paymentCollection
    .aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ])
    .toArray();
  const revenue = result[0]?.totalRevenue || 0;
  res.send({
    users,
    menuItems,
    orders,
    revenue,
  });
};

const orderState = async (req, res) => {
  const result = await paymentCollection
    .aggregate([
      {
        $unwind: "$menuItemIds",
      },
      {
        $lookup: {
          from: "menu",
          localField: "menuItemIds",
          foreignField: "_id",
          as: "menuItems",
        },
      },
      {
        $unwind: "$menuItems",
      },
      {
        $group: {
          _id: "$menuItems.category",
          quantity: { $sum: 1 },
          revenue: { $sum: "$menuItems.price" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          quantity: "$quantity",
          revenue: "$revenue",
        },
      },
    ])
    .toArray();
  res.send(result);
};

const cancelOrder = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userEmail = req.decoded.email;

    const result = await paymentCollection.deleteOne({
      _id: new ObjectId(bookingId),
      email: userEmail,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Order not found or you are not authorized." });
    }

    res.status(200).json({ message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: "Something went wrong while cancelling the order." });
  }
};

const orderStatusUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: status,
      },
    };

    const result = await paymentCollection.updateOne(filter, updatedDoc);
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Order status  Update successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong .order status not updated." });
  }
};

module.exports = {
  stripePaymentIntent,
  paymentHistory,
  allPayment,
  adminState,
  orderState,
  cancelOrder,
  orderStatusUpdate,
};
