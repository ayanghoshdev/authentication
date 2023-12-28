const express = require("express");
const { protect } = require("../controller/authController");
const conversationController = require("../controller/conversationController");

const router = express.Router();

router.route("/").post(protect, conversationController.startConversation);
router.route("/messages").post(protect, conversationController.sendMessages);

module.exports = router;
