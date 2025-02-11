const express = require("express");
const { use } = require("react");

//calling function or creating instance of express to access its method of express
const app = express();

const { authAdmin, authUser } = require("./middlewares/auth");

app.use("/admin", authAdmin);

app.use("/admin/getAllData", (req, res) => {
  res.send("get all data");
});

app.use("/admin/deleteData", (req, res) => {
  res.send("delete data");
});

app.use("/user/login", (req, res) => {
  res.send("user logged");
});

app.use("/user", authUser, (req, res) => {
  res.send("hi user");
});

app.listen(7777, () => "connecting to server port number 7777");
