const express = require("express");
const { protect, restrictTo } = require("../controller/authController");

const notificationController = require("../controller/notificationsController");

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    restrictTo("admin"),
    notificationController.getAllNotifications
  );

module.exports = router;
