const express = require("express");
const userRoute = require("./routes/userRoute");
const globalErrorController = require("./controller/errorController");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRoute);

//TEST ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Working fine go ahead",
  });
});

app.use(globalErrorController);
module.exports = app;
