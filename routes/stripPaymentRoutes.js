const express = require("express");
const {
  stripePaymentIntent,
  paymentHistory,
  allPayment,
  adminState,
  orderState,
  cancelOrder,
} = require("../controllers/stripPaymentController");
const { verifyToken } = require("../controllers/jwtController");
const { verifyAdmin } = require("../controllers/userController");

const router = express.Router();

router.post("/create-payment-intent", stripePaymentIntent);
router.post("/payment", paymentHistory);
router.get("/payments", verifyToken, allPayment);
router.get("/admin-state", verifyToken, verifyAdmin, adminState);
router.get("/order-state", verifyToken, verifyAdmin, orderState);

// cancel order
router.delete("/cancelOrder/:id", verifyToken, cancelOrder);

module.exports = router;
