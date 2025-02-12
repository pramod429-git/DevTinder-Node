const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

//calling function or creating instance of express to access its method of express
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("data is added to data base successfully");
    console.log("added");
  } catch (error) {
    res.status(400).send(`Band request =>${error.message}`);
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
