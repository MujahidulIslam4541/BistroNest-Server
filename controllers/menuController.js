const { ObjectId } = require("mongodb");
const client = require("../config/db");
const menuCollection = client.db("bistroNestDb").collection("menu");

exports.getMenu = async (req, res) => {
  const result = await menuCollection.find().toArray();
  res.send(result);
};


// get menu with pagination
exports.getMenuWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 0; // default 0 → all items
    let items, total, totalPages;

    if (limit > 0) {
      const skip = (page - 1) * limit;
      total = await menuCollection.countDocuments();
      items = await menuCollection.find().skip(skip).limit(limit).toArray();
      totalPages = Math.ceil(total / limit);
    } else {
      items = await menuCollection.find().toArray();
      total = items.length;
      totalPages = 1;
    }

    res.json({
      success: true,
      data: items,
      page: limit ? page : 1,
      perPage: limit || total,
      total,
      totalPages,
    });

    // console.log(success,items,page,perPage,total,totalPages)
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
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
  const query = { _id: id };
  const result = await menuCollection.findOne(query);
  res.send(result);
};
