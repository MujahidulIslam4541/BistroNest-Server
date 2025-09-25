const express = require("express");
const router = express.Router();
const {
  getMenu,
  menuPost,
  deleteMenu,
  getMenuById,
} = require("../controllers/menuController");
const { verifyToken } = require("../controllers/jwtController");
const { verifyAdmin } = require("../controllers/userController");

router.get("/menu", getMenu);
router.post("/menu", verifyToken, verifyAdmin, menuPost);
router.delete("/menu/:id", verifyToken, verifyAdmin, deleteMenu);
router.get("/menu/:id", getMenuById);
module.exports = router;
