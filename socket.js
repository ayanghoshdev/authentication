const socketIO = require("socket.io");
const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const io = socketIO(server, {
  transports: ["polling"],
  cors: {
    origin: "http://localhost:5173",
  },
});

// Handle connection events
io.on("connection", (socket) => {
  console.log("A user connected");
  // Additional setup for socket connection events
});

module.exports = { io, server };
