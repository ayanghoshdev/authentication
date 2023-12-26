const chatController = require("../controller/chatController");
const express = require("express");
const { protect, restrictTo } = require("../controller/authController");

const router = express.Router();

router.route("/").get(protect, chatController.userChatHistory);
router
  .route("/user/send/:adminId")
  .post(protect, chatController.sendMessageToAdmin);
router
  .route("/admin/send/:userId")
  .post(protect, restrictTo("admin"), chatController.sendMessageToUser);
router.route("/:targetId");

module.exports = router;
