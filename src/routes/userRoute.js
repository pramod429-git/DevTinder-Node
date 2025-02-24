const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const router = express.Router();
const USER_SAVE_DATA = "firstName lastName age gender skills photoUrl about";
const User = require("../models/user");

router.get("/user/review/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "Interested",
    }).populate("fromUserId", USER_SAVE_DATA);
    if (!connectionRequest) {
      return res.status(400).send("invalid request");
    }
    res.json({ message: `received requests are `, connectionRequest });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

router.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "Accepted" },
        { toUserId: loggedInUser._id, status: "Accepted" },
      ],
    })
      .populate("fromUserId", USER_SAVE_DATA)
      .populate("toUserId", USER_SAVE_DATA);

    //console.log(connectionRequest);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    console.log(data);

    if (!connectionRequest) {
      throw new Error("Invalid request");
    }
    res.json({ message: "your connections", data });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.get("/feed", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //pagination
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    limit > 50 ? 50 : limit;
    //finding the connectionRequest db data of user fromUserId and toUserId
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    //console.log(connectionRequest.length);
    const hideUserConnectionRequest = new Set();
    //finding unique value in connection request db
    connectionRequest.forEach((req) => {
      hideUserConnectionRequest.add(req.fromUserId._id.toString());
      hideUserConnectionRequest.add(req.toUserId._id.toString());
    });
    // console.log(hideUserConnectionRequest);

    //finding the user not present in the hideUserConnectionRequest from connectionRequest collection
    const user = await User.find({
      $and: [
        //this condition is require already have details in the connectionRequest db
        { _id: { $nin: Array.from(hideUserConnectionRequest) } },
        //this condition is require not show same user details(new user)
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAVE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(user);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
