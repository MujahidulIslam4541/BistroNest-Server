const express = require("express");
const { verifyToken } = require("../controllers/jwtController");
const { bookingPost, getBooking, deleteBooking } = require("../controllers/BookingController");
const router = express.Router();

router.post('/booking',verifyToken,bookingPost)
router.get('/booking',verifyToken,getBooking)
router.delete('/booking/:id',verifyToken,deleteBooking)

module.exports=router;