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
exports.getAllUsers = async (req, res) => {
  const users = await userCollection.find().toArray();
  res.send(users);
};

// DELETE: Delete a user from the database
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
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
exports.verifyAdmin= async(req,res,next)=>{
    const email=req.decoded.email;
    const query={email:email}
    const user=await userCollection.findOne(query)
    const isAdmin=user?.role==="admin"
    if(!isAdmin){
      return res.status(403).send({message:"Forbidden  Access"})
    }
    next()
}
