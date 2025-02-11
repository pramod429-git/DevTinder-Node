const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pramodnode:zOy7x8G0lmJ8Ryj8@pramodnode.5vpd3.mongodb.net/"
  );
};

module.exports = { connectDB };
