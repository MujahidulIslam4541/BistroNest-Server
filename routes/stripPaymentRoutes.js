const express = require("express");
const {
  stripePaymentIntent,
  paymentHistory,
} = require("../controllers/stripPaymentController");

const router = express.Router();

router.post("/create-payment-intent", stripePaymentIntent);
router.post("/payment", paymentHistory);

module.exports = router;
