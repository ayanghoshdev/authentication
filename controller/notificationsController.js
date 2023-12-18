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

  // const notification = await Notification.findById(req.params.notificationId);
  // console.log(notification);

  const notification = await Notification.findByIdAndDelete(
    req.params.notificationId
  );
  if (!notification)
    return next(new AppError("No notificaiton found with this id.", 404));

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});
