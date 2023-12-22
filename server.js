const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const http = require("http");
const socketIO = require("socket.io");

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Sutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// const db = process.env.LOCAL_DATABASE;
const db = process.env.CLOUD_DATABASE.replace(
  "<password>",
  process.env.DB_PASS
);

// DATABASE CONNECTION
mongoose.connect(db).then(() => {
  console.log("Database connected successfully");
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server, {
  // transports: ["polling"],
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8081"],
  },
});
// app.use((req, res, next) => {
//   req.io = io;
//   return next();
// });

app.set("socketio", io);
io.on("connection", (socket) => {
  console.log("A user is connected " + socket.id);

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });

  // Passing io to the req
});

server.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Sutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
