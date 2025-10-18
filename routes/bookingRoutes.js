const express = require("express");
const { verifyToken } = require("../controllers/jwtController");
const { bookingPost, getBooking, deleteBooking, userState, bookingStatusUpdate } = require("../controllers/BookingController");
const { verifyAdmin } = require("../controllers/userController");
const router = express.Router();

router.post('/booking',verifyToken,bookingPost)
router.get('/booking',verifyToken,getBooking)
router.delete('/booking/:id',verifyToken,deleteBooking)
router.get('/userState',verifyToken,userState)

// booking  status update only admin
router.patch('/booking/:id',verifyToken,verifyAdmin,bookingStatusUpdate)

module.exports=router;