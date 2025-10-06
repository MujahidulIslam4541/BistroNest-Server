const express = require("express");
const {
  stripePaymentIntent,
  paymentHistory,
  allPayment,
  adminState,
} = require("../controllers/stripPaymentController");
const { verifyToken } = require("../controllers/jwtController");
const { verifyAdmin } = require("../controllers/userController");

const router = express.Router();

router.post("/create-payment-intent", stripePaymentIntent);
router.post("/payment", paymentHistory);
router.get("/payments/:email", verifyToken, allPayment);
router.get("/admin-state",verifyToken,verifyAdmin, adminState);

module.exports = router;
