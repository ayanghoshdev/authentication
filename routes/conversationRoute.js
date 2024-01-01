const express = require("express");
const { protect } = require("../controller/authController");
const conversationController = require("../controller/conversationController");

const router = express.Router();

router
  .route("/")
  .get(protect, conversationController.getUserConversations)
  .post(protect, conversationController.startConversation);

router
  .route("/:conversationId")
  .get(protect, conversationController.getSingleConversation);

router.route("/messages").post(protect, conversationController.sendMessages);

module.exports = router;
