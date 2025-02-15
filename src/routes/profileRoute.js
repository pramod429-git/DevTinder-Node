const express = require("express");
const app = express();

app.use(express.json());
const { authUser } = require("../middlewares/auth");
const {
  validateEditProfile,
  validateForgotPassword,
} = require("../utils/validattion");
const router = express();
const bcrypt = require("bcrypt");

router.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send("profile loadded successfully \n" + user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/profile/edit", authUser, async (req, res) => {
  try {
    validateEditProfile(req.body);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      massage: `${loggedInUser.firstName} your profile is updated `,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

router.patch("/profile/changePassword", authUser, async (req, res) => {
  try {
    const { password } = req.body;
    validateForgotPassword(req.body);
    const loggedInUser = req.user;
    const hashedPassword = await bcrypt.hash(password, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.send("password changed successfully!!");
  } catch (err) {
    res.status(400).send("ERRORs: " + err.message);
  }
});

module.exports = router;
