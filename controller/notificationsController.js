const Notification = require("../models/notificationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find().populate({
    path: "test",
    populate: {
      path: "user",
    },
  });

  res.status(200).json({
    success: true,
    notifications,
  });
});

exports.deleteOneNotifications = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.notificationId))
    return next(new AppError("Invalid notificaiton id", 400));

  await Notification.deleteOne(req.params);

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});
