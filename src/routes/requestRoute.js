const express = require("express");
const { authUser } = require("../middlewares/auth");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

router.post("/request/send/:status/:userId", authUser, async (req, res) => {
  try {
    //read the request
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    //here i want validation for request is either Intrested or Ignored

    const allowedStatus = ["Intrested", "Ignored"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const toUser = await User.findById(toUserId);
    const toUserName = toUser.firstName;

    if (!toUser) {
      return res.json({ message: "invalid request" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(400).json({ message: `request is already sent` });
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();

    res.json({
      message: `${user.firstName} ${status} ${toUserName} profile `,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
