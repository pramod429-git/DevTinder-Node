const express = require("express");

//calling function or creating instance of express to access its method of express
const app = express();

//to give response we have to give request handler

// app.use("/user", (req, res) => {
//   res.send("hahahahaha");
// });

app.get("/user", (req, res) => {
  console.log(req.query); //{ id: '123', password: '321' }
  res.send("Hi this from server");
});

// app.get("/user/:userId/:userPw", (req, res) => {
//   //   console.log(req.params); //{ userId: '123', userPw: '321' }
//   console.log(req.query); //{}
//   res.send("Hi this from server");
// });

// app.post("/user", (req, res) => {
//   res.send("data is save successfully!");
// });

// app.delete("/user", (req, res) => {
//   res.send("data is deleted successfully!");
// });

app.listen(7777, () => "connecting to server port number 7777");
