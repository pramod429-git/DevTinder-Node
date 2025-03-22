const socket = require("socket.io");
const cors = require("cors");
const crypto = require("crypto");

const getRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

//Since I am getting CORS error for PACTH method added header and modified in vite.config.js file
const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Allow cookies & credentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

const initilizeSocket = (server) => {
  const io = socket(server, { cors: corsOptions });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ photoUrl, firstName, userId, targetUserId }) => {
      const roomId =
        //[userId, targetUserId].sort().join("_");
        getRoomId(userId, targetUserId);
      console.log(firstName + " Joined Room " + roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      ({ photoUrl, firstName, userId, targetUserId, text }) => {
        const roomId = getRoomId(userId, targetUserId);
        //[userId, targetUserId].sort().join("_");
        console.log(firstName + " " + text);
        io.to(roomId).emit("messageRecieved", { photoUrl, firstName, text });
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = { initilizeSocket };
