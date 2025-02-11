const express = require("express");

//calling function or creating instance of express to access its method of express
const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("response1");
    next();
    // res.send("response 2");
  },
  (req, res, next) => {
    console.log("response 2");
    res.send("response 2");
  }
);

app.listen(7777, () => "connecting to server port number 7777");
