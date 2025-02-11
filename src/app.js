const express = require("express");

//calling function or creating instance of express to access its method of express
const app = express();

//to give response we have to give request handler

app.use("/hello", (req, res) => {
  res.send("Hi this from servers hello");
});

// request handler to hander request localhost:7777/path route
app.use("/path", (req, res) => {
  res.send("Hi this from server /path");
});

app.listen(7777, () => "connecting to server port number 7777");
