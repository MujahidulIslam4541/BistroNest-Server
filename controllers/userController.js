const { ObjectId } = require("mongodb");
const client = require("../config/db");
const userCollection = client.db("bistroNestDb").collection("users");

// POST: User information added to the database
exports.postUser = async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  const existingUser = await userCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: "user already exits", insertedId: null });
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
};

// GET :get all Users in database
exports.getUserProfile = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await userCollection
      .find()
      .sort()
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await userCollection.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE: Delete a user from the database
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
};

// update user  profile
exports.updateUserProfile = async (req, res) => {
  try {
    const email = req.params.email;
    const { displayName, photoURL } = req.body;
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (photoURL) updateData.photoURL = photoURL;

    const result = await userCollection.updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Make Admin user
exports.makeAdmin = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: { role: "admin" },
  };
  const result = await userCollection.updateOne(query, updateDoc);
  res.send(result);
};

// verify admin
exports.getAdmin = async (req, res) => {
  const email = req.params.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "unAuthorized Access" });
  }
  const query = { email: email };
  const user = await userCollection.findOne(query);
  let admin = false;
  if (user) {
    admin = user?.role === "admin";
  }
  res.send({ admin });
};

// use verify admin after verify token
exports.verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res.status(403).send({ message: "Forbidden  Access" });
  }
  next();
};
