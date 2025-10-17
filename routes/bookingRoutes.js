const express = require("express");
const { verifyToken } = require("../controllers/jwtController");
const { bookingPost, getBooking, deleteBooking, userState } = require("../controllers/BookingController");
const router = express.Router();

router.post('/booking',verifyToken,bookingPost)
router.get('/booking',verifyToken,getBooking)
router.delete('/booking/:id',verifyToken,deleteBooking)
router.get('/userState',verifyToken,userState)

module.exports=router;