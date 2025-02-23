const express = require("express");
const { connectDB } = require("./config/database");
const cookie = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const requestRoute = require("./routes/requestRoute");
const userRoute = require("./routes/userRoute");

const app = express();

//Since I am getting CORS error for PACTH method added header and modified in vite.config.js file
const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Allow cookies & credentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

// ✅ Apply CORS middleware BEFORE routes
app.use(cors(corsOptions));

// ✅ Express middlewares
app.use(express.json());
app.use(cookie());

// ✅ Routes
app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", userRoute);

// ✅ Connect to DB and start server
connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(7777, () => console.log("Server running on port 7777"));
  })
  .catch((err) => console.log(`Something went wrong: ${err}`));
