const client = require("../config/db");
const bookingController = client.db("bistroNestDb").collection("booking");

exports.bookingPost = async (req, res) => {
  try {
    const userId = req.decoded._id
    const booking = { ...req.body, userId }; 
    const result = await bookingController.insertOne(booking); 
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed", error });
  }
};
