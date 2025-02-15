const express = require("express");
const { connectDB } = require("./config/database");
const cookie = require("cookie-parser");

const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const requestRoute = require("./routes/requestRoute");

//calling function or creating instance of express to access its method of express
const app = express();

app.use(express.json());

app.use(cookie());

app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRoute);

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
