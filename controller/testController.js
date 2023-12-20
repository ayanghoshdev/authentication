const Test = require("../models/testModel");
const Notification = require("../models/notificationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

// CREATE
exports.createTest = catchAsync(async (req, res, next) => {
  const { name, description, price, location } = req.body;

  // check all fields are present in req or not
  if (!(name && description && price && location))
    return next(
      new AppError("'name, description, price, location', are required", 400)
    );

  // Create test and notification
  const test = await Test.create({ ...req.body, user: req.user._id });
  const notification = await Notification.create({ test: test._id });

  // req.socket.on("connection", (socket) => {
  //   console.log(socket);
  //   socket.emit("new-notification", notification);
  // });
  notification.test = test;
  const io = req.app.get("socketio");
  io.emit("new-notification", notification);

  await res.status(201).json({
    success: true,
    test,
  });
});

// READ All (admin)
exports.getAllTests = catchAsync(async (req, res, next) => {
  const tests = await Test.find();
  res.status(200).json({
    success: true,
    tests,
  });
});

// Read User's all tests
exports.getUserTests = catchAsync(async (req, res, next) => {
  const tests = await Test.find({ user: req.user });
  if (!tests) return next(new AppError("No test found", 404));
  res.status(200).json({
    success: true,
    tests,
  });
});

// READ ONE
exports.getSingleTest = catchAsync(async (req, res, next) => {
  const { testId } = req.params;
  if (!testId) return next(new AppError("testId not found in url params", 400));

  const test = await Test.findById(testId);
  if (!test) return next(new AppError("No test found", 404));

  res.status(200).json({
    success: true,
    test,
  });
});

// // UPDATE
exports.updateTestStatus = catchAsync(async (req, res, next) => {
  const { testId } = req.params;
  if (!testId) return next(new AppError("testId not found in url params", 400));

  const { status } = req.body;

  if (!status) return next(new AppError("status is required", 400));

  const test = await Test.findById(testId);

  if (!test) return next(new AppError("No test found", 404));

  test.status = status;
  await test.save();

  res.status(200).json({
    success: true,
    test,
  });
});

exports.updateTest = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.testId))
    return next(new AppError("Invalid test id", 400));

  const updatedTest = await Test.findByIdAndUpdate(
    req.params.testId,
    req.body,
    { new: true }
  );
  res.status(201).json({
    success: true,
    message: "Successfully updated.",
    test: updatedTest,
  });
});

// // DELETE
// exports.deleteTest = catchAsync(async (req, res, next) => {});
