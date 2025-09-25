const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;
const client=require('./config/db')
const menuRoutes=require('./routes/menuRoutes')
const reviewsRoute=require('./routes/reviewRoutes')
const cartRoute=require('./routes/cartRoutes')
const userRoute=require('./routes/userRoutes')
const jwtRoute=require('./routes/jwtRoutes')

// middleware
app.use(cors());
app.use(express.json());


async function run() {
  try {
    
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Routes
app.use(userRoute)
app.use(menuRoutes)
app.use(reviewsRoute)
app.use(cartRoute)
app.use(jwtRoute)




app.get("/", (req, res) => {
  res.send("bistroNest is running");
});
app.listen(port, () => {
  console.log(`bistroNest Project is running ${port}`);
});
