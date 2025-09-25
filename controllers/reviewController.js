const client = require("../config/db");
const reviewsCollection = client.db("bistroNestDb").collection("reviews");

exports.getReview = async (req, res) => {
  const result = await reviewsCollection.find().toArray();
  res.send(result);
};
