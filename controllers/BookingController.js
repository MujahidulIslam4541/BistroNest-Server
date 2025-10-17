const { ObjectId } = require("mongodb");
const client = require("../config/db");
const bookingController = client.db("bistroNestDb").collection("booking");

exports.bookingPost = async (req, res) => {
  try {
    const userId = req.decoded._id;
    const booking = { ...req.body, userId };
    const result = await bookingController.insertOne(booking);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed", error });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const userId = req.decoded._id;
    const result = await bookingController.find({ userId }).toArray();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get bookings", error });
  }
};



exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id; 
    const userId = req.decoded._id; 
    const result = await bookingController.deleteOne({
      _id: new ObjectId(bookingId),
      userId: userId,
    });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete booking", error });
  }
};
