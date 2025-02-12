const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");

//calling function or creating instance of express to access its method of express
const app = express();

app.use(express.json());

//find the document based on user emailId
app.get("/user", async (req, res) => {
  try {
    const userEmailId = req.body.emailId;

    const user = await User.find({ emailId: userEmailId });
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
  try {
    const users = await User.find({});

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
  try {
    const userData = req.body; // read the request
    const user = new User(userData);

    await user.save();
    res.send("data is added to data base successfully");
    console.log("added");
  } catch (error) {
    res.status(400).send(`Band request =>${error.message}`);
  }
});

// delete the data in the database
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    //const deleteUser = await User.findByIdAndDelete(userId);
    await User.findByIdAndDelete({ _id: userId });

    res.send("user deleted successfully!");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// update the data in the database
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const userUpdate = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

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
