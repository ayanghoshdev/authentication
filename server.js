const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Sutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const db = process.env.LOCAL_DATABASE;

// DATABASE CONNECTION
mongoose.connect(db).then(() => {
  console.log("Database connected successfully");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Sutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
