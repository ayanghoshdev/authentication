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

router
  .route("/:notificationId")
  .delete(
    protect,
    restrictTo("admin"),
    notificationController.deleteOneNotifications
  );

module.exports = router;
