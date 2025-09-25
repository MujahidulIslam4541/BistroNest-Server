const express = require("express");
const router = express.Router();
const {
  postUser,
  getAllUsers,
  deleteUser,
  makeAdmin,
  getAdmin,
  verifyAdmin,
} = require("../controllers/userController");
const { verifyToken } = require("../controllers/jwtController");

router.post("/user", postUser);
router.get("/users", verifyToken,verifyAdmin, getAllUsers);
router.delete("/user/:id", verifyToken,verifyAdmin, deleteUser);
router.patch("/user/admin/:id", verifyToken, verifyAdmin, makeAdmin); // Assuming makeAdmin is defined in userController
router.get("/user/admin/:email",verifyToken, getAdmin);
module.exports = router;
