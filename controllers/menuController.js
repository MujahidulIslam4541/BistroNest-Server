const { ObjectId } = require("mongodb");
const client = require("../config/db");
const menuCollection = client.db("bistroNestDb").collection("menu");

exports.getMenu = async (req, res) => {
  const result = await menuCollection.find().toArray();
  res.send(result);
};

exports.menuPost = async (req, res) => {
  const menu = req.body;
  const result = await menuCollection.insertOne(menu);
  res.send(result);
};

exports.deleteMenu = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await menuCollection.deleteOne(query);
  res.send(result);
};

// TODO:NOT working get item by id
exports.getMenuById = async (req, res) => {
  const id = req.params.id;
  const query = { _id: (id) };
  const result = await menuCollection.findOne(query);
  res.send(result);
};
