const client = require("../config/db");
const reviewsCollection = client.db("bistroNestDb").collection("reviews");

exports.review = async (req, res) => {
  try {
    const data = req.body;
    const result = await reviewsCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    return res.status(500).send({message:"review not added"})
  }
};

exports.getReview = async (req, res) => {
  const result = await reviewsCollection.find().toArray();
  res.send(result);
};
