require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const cookie = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const requestRoute = require("./routes/requestRoute");
const userRoute = require("./routes/userRoute");
const paymentRoute = require("./routes/paymentRoute");
const { initilizeSocket } = require("./utils/socket");

const app = express();
//Since I am getting CORS error for PACTH method added header and modified in vite.config.js file
const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Allow cookies & credentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
//as soon as application runs cron job should run
require("./utils/cronJob");

// ✅ Apply CORS middleware BEFORE routes
//cors() for Express routes but not for WebSockets.
app.use(cors(corsOptions));

// ✅ Express middlewares
app.use(express.json());
app.use(cookie());

// ✅ Routes
app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", userRoute);
app.use("/", paymentRoute);

// webSoket require created server using http
const server = http.createServer(app);
initilizeSocket(server);

// ✅ Connect to DB and start server
connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    //listen the server using http server
    server.listen(process.env.PORT, () =>
      console.log("Server running on port 7777")
    );
  })
  .catch((err) => console.log(`Something went wrong: ${err}`));
