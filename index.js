const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;
const client = require("./config/db");

// import all routes
const menuRoutes = require("./routes/menuRoutes");
const reviewsRoute = require("./routes/reviewRoutes");
const cartRoute = require("./routes/cartRoutes");
const userRoute = require("./routes/userRoutes");
const jwtRoute = require("./routes/jwtRoutes");
const stripePaymentRoutes = require("./routes/stripPaymentRoutes");

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
}
run();

// Routes
app.use(userRoute);
app.use(menuRoutes);
app.use(reviewsRoute);
app.use(cartRoute);
app.use(jwtRoute);
app.use(stripePaymentRoutes);

app.get("/", (req, res) => {
  res.send("BistroNest server is running ✅");
});

app.listen(port, () => {
  console.log(`🚀 BistroNest server running on port ${port}`);
});
