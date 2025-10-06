const express = require("express");
const { stripePaymentIntent } = require("../controllers/stripPaymentController");

const router = express.Router();

router.post("/create-payment-intent", stripePaymentIntent);

module.exports = router;
