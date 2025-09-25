const { ObjectId } = require("mongodb");
const client = require("../config/db");
const cartCollection = client.db("bistroNestDb").collection("carts");

// POST: Add item to cart
exports.postCart = async (req, res) => {
  const cartItem = req.body;
  const result = await cartCollection.insertOne(cartItem);
  res.send(result);
};

// GET: Get all cart items

exports.getCart = async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const result = await cartCollection.find(query).toArray();
  res.send(result);
};

// DELETE :delete one cart item

exports.deleteCart=async(req,res)=>{
  const id=req.params.id;
  const query = { _id: new ObjectId(id) };
  const result=await cartCollection.deleteOne(query)
  res.send(result)
}
