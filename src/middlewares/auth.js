const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authUser = async (req, res, next) => {
  try {
    //read the cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    //validate the cookie
    const decoadedValue = await jwt.verify(token, "dev@tinder");
    const { _id } = decoadedValue;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    //send response
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};
module.exports = { authUser };
