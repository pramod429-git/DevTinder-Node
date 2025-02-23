const express = require("express");
const User = require("../models/user");
const { validateSignUp, validateLogin } = require("../utils/validattion");
const validator = require("validator");
const bcrypt = require("bcrypt");
const router = express.Router();

// add the data to database
router.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, gender } = req.body; // read the request
  try {
    //validation
    validateSignUp(req);
    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    //console.log(firstName, lastName, emailId, { password: passwordHash });
    // save to db
    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      password: passwordHash,
    });
    await user.save();
    res.send("data is added to data base successfully");
    console.log("added");
  } catch (error) {
    res.status(400).send(`Band request =>${error.message}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }
    if (!validator.isEmail(emailId)) {
      throw new Error("enter a correct emailId");
    }

    //async operation so await hashing or bcrypt
    const isValidPassword = await user.ValidPassword(password);
    //token creatin and  will expire after 7 days
    const token = await user.getJwt();

    if (!isValidPassword) {
      throw new Error("invalid credential");
    } else {
      //using express sending cookie with cookie key word
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); //cookis will expire after 8 hrs
      res.json({ message: "login successfully!!", data: user });
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

router.post("/logout", (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("logout successfully");
});

module.exports = router;
