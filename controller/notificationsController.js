const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");

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
