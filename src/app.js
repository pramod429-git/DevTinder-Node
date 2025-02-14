const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validattion");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authUser } = require("./middlewares/auth");

//calling function or creating instance of express to access its method of express
const app = express();

app.use(express.json());

app.use(cookie());

//find the document based on user emailId
app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;

  const user = await User.find({ emailId: userEmailId });
  try {
    if (!user.length) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//find all the data
app.get("/feed", async (req, res) => {
  //   const usersRequest = req.body; //read the request

  const users = await User.find({});
  try {
    if (!users.length) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
      console.log("retrived data");
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// add the data to database
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }
    if (!validator.isEmail(emailId)) {
      throw new Error("enter a correct emailId");
    }

    //async operation so await
    const isValidPassword = await bcrypt.compare(password, user.password);
    //token will expire after 7 days
    const token = await jwt.sign({ _id: user._id }, "dev@tinder", {
      expiresIn: "7d",
    });

    if (!isValidPassword) {
      throw new Error("invalid credential");
    } else {
      //using express sending cookie with cookie key word
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); //cookis will expire after 8 hrs
      res.send("login successfully!!");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send("profile loadded successfully \n" + user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/sendConnectionRequest", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent a connection request!!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// delete the data in the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    //const deleteUser = await User.findByIdAndDelete(userId);
    await User.findByIdAndDelete({ _id: userId });

    res.send("user deleted successfully!");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// update the data in the database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const userUpdate = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    ALLOWED_UPDATE = [
      "firstName",
      "lastName",
      "password",
      "age",
      "about",
      "photoUrl",
      "skills",
    ];

    const isAllowedProfile = Object.keys(data).every((key) =>
      ALLOWED_UPDATE.includes(key)
    );

    if (!isAllowedProfile) {
      throw new Error("cannot update the field");
    }

    if (data.skills.length > 10) {
      res.status(400).send("can only add 10 skills");
      return;
    }

    res.send(`user data updated as \n ${userUpdate}`);
    console.log(userUpdate);
  } catch (err) {
    res.status(400).send("something went wrong " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("data base connected successfully!!");
    app.listen(7777, () =>
      console.log("connecting to server port number 7777")
    );
  })
  .catch((err) => {
    console.log(`something went wrong ${err}`);
  });
