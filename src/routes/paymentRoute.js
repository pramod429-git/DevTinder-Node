const express = require("express");
const { authUser } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpaySecret");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");
const user = require("../models/user");

const router = express.Router();

router.post("/payment/create", authUser, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt #1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    const payment = new Payment({
      userId: req.use._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.emailId,
        membershipType: order.membershipType,
      },
    });
    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//path should be same as when we setup onto the
router.post("/payment/webhook", async (req, res) => {
  try {
    const isVaildWebhook = validateWebhookSignature(
      JSON.stringify(req.body),
      req.headers("X-Razorpay-Signature"),
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (isVaildWebhook) {
      //we want to update DB the payment collection of status:captured or failuer
      const { paymentDetails } = req.body.payload.payment.entity;
      const payment = new Payment.findOne({
        orderId: paymentDetails.order_id,
      });
      payment.status = paymentDetails.status;

      await payment.save();

      // here we need to make the user as premium and set the user membershiptype:silver or gold
      const user = new User.findOne({ _id: payment.userId });
      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;
      await user.save();
    } else {
      res.status(500).json({ message: "Invalid webhook details" });
    }
    //we have to provide response to razorpay other wise it continously listen for response
    res.status(200).json({ message: "webhook recived successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get("/premium/verify", authUser, async (req, res) => {
  try {
    const user = req.user;
    if (user.isPremium) {
      return res.json({ isPremium: true });
    } else {
      return res.json({ isPremium: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
