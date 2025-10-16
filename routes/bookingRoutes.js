const express = require("express");
const { verifyToken } = require("../controllers/jwtController");
const { bookingPost, getBooking } = require("../controllers/BookingController");
const router = express.Router();

router.post('/booking',verifyToken,bookingPost)
router.get('/booking',verifyToken,getBooking)

module.exports=router;