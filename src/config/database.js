const mongoose = require("mongoose");
const { connectingDBURL } = require("./connectingURL");

const connectDB = async () => {
  await mongoose.connect(connectingDBURL);
};

module.exports = { connectDB };
