const express = require("express");
const { authUser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const router = express.Router();
const USER_SAVE_DATA = "firstName lastName age gender skills";

router.get("/user/review/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "Interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
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

module.exports = router;
