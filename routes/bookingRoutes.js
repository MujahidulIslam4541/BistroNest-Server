const express = require("express");
const { verifyToken } = require("../controllers/jwtController");
const { bookingPost } = require("../controllers/BookingController");
const router = express.Router();

router.post('/booking',bookingPost)

module.exports=router;