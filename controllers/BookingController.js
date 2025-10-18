const { ObjectId } = require("mongodb");
const client = require("../config/db");
const bookingController = client.db("bistroNestDb").collection("booking");
const reviewsCollection = client.db("bistroNestDb").collection("reviews");
const paymentCollection = client.db("bistroNestDb").collection("payments");
const userCollection = client.db("bistroNestDb").collection("users");

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
    const email = req.decoded.email;
    const user = await userCollection.findOne({ email: email });

    if (!user) {
      return res.status(403).json({ message: "user Not Authorized" });
    }
    let query = {};
    if (user.role !== "admin") {
      query = { email };
    }

    const result = await bookingController.find(query).sort({ _id: -1 }).toArray();
    res.status(200).json(result);
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
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete booking", error });
  }
};

// user states
exports.userState = async (req, res) => {
  try {
    const userId = req.decoded._id;
    const bookingsCount = await bookingController.countDocuments({ userId });
    const reviewsCount = await reviewsCollection.countDocuments({ userId });
    const ordersCount = await paymentCollection.countDocuments({ userId });
    res.status(200).json({
      bookings: bookingsCount,
      orders: ordersCount,
      reviews: reviewsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user stats", error });
  }
};

 exports.bookingStatusUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: status,
      },
    };

    const result = await bookingController.updateOne(filter, updatedDoc);
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "booking status  Update successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong .booking status not updated." });
  }
};
