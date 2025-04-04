const mongoose = require("mongoose");
require("dotenv").config();
const rawPassword = process.env.MONGO_PASSWORD;
const encodedPassword = encodeURIComponent(rawPassword);
const mongoURI = `mongodb+srv://Sanskar:${encodedPassword}@sanskarcluster0.wl3mx.mongodb.net/?retryWrites=true&w=majority&appName=SanskarCluster0/SANSKAR_TEST_DATABASE`;
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (e) {
    console.log(e);
  }
};
module.exports = connectToMongo;
