const Test = require("../models/testModel");
const Notification = require("../models/notificationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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
  await Notification.create({ test: test._id });

  await res.status(201).json({
    success: true,
    test,
  });
});

// READ
exports.getAllTests = catchAsync(async (req, res, next) => {
  const tests = await Test.find();
  res.status(200).json({
    success: true,
    tests,
  });
});

// // UPDATE
// exports.updateTest = catchAsync(async (req, res, next) => {});

// // DELETE
// exports.deleteTest = catchAsync(async (req, res, next) => {});
