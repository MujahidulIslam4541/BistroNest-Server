const client = require("../config/db");
const reviewsCollection = client.db("bistroNestDb").collection("reviews");

exports.review = async (req, res) => {
  try {
    const userId=req.decoded._id
    const data = req.body;
    const reviewDoc = { ...data, userId };
    const result = await reviewsCollection.insertOne(reviewDoc);
    res.send(result);
  } catch (error) {
    return res.status(500).send({message:"review not added"})
  }
};

exports.getReview = async (req, res) => {
  const result = await reviewsCollection.find().toArray();
  res.send(result);
};
