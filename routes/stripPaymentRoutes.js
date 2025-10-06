const express = require("express");
const {
  stripePaymentIntent,
  paymentHistory,
  allPayment,
} = require("../controllers/stripPaymentController");
const { verifyToken } = require("../controllers/jwtController");

const router = express.Router();

router.post("/create-payment-intent", stripePaymentIntent);
router.post("/payment", paymentHistory);
router.get("/payments/:email", verifyToken, allPayment);

module.exports = router;
