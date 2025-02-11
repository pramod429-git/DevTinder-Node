const express = require("express");
const { use } = require("react");
const { connectDB } = require("./config/database");

//calling function or creating instance of express to access its method of express
const app = express();

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

app.get("/", (req, res) => {
  res.send("hello");
});

// app.use("/userData", (req, res) => {
//   try {
//     throw new Error("ahsn");
//     res.send("User Data");
//   } catch (err) {
//     res.status(500).send(`${err.message} => some error contact support team `);
//   }
// });

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.send("something went wrong");
//   }
// });
