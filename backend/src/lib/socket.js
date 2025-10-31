import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Store online users
const userSocketMap = {}; // { userId: socketId }

// ✅ Allow both local and deployed frontend URLs
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // local dev
      "https://chat-app-67cw.vercel.app", // ✅ your deployed frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Helper function to get receiver socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// ✅ Socket.io event handlers
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Send list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
