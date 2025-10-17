const jwt = require("jsonwebtoken");
const client = require("../config/db");

// Generate JWT
exports.jwtPost = async (req, res) => {
  try {
    const user = req.body;
    const db = client.db("bistroNestDb");
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ email: user.email });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const payload = {
      _id: existingUser._id,
      email: existingUser.email,
    };

    const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Token generation failed", error });
  }
};

// Verify JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    // console.log("Decoded JWT:", decoded);
    next();
  });
};
