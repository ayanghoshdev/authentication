const Chat = require("../models/chatModel");
const catchAsync = require("../utils/catchAsync");
const app = require("../app");
const AppError = require("../utils/appError");

// Send to admin
exports.sendMessageToAdmin = catchAsync(async (req, res, next) => {
  const { adminId } = req.params;
  const { message } = req.body;

  const newChat = await Chat.create({
    sender: req.user._id,
    recipient: adminId,
    message,
  });

  const io = req.app.get("socketio");
  // send message only to admin
  io.sockets.in(adminId).emit("chat-message", newChat);

  res.status(200).json({
    success: true,
    chat: newChat,
    message: "Message sent successfully.",
  });
});

// Send to user
exports.sendMessageToUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { message } = req.body;

  const newChat = await Chat.create({
    sender: req.user._id,
    recipient: userId,
    message,
  });

  const io = req.app.get("socketio");
  // send message only to the specific user
  io.sockets.in(userId).emit("chat-message", newChat);

  res.status(200).json({
    success: true,
    chat: newChat,
    message: "Message sent successfully.",
  });
});

// User history
exports.userChatHistory = catchAsync(async (req, res, next) => {
  const chatHistory = await Chat.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  });

  res.status(200).json({
    success: true,
    history: chatHistory,
  });
});

// // Admin history
// exports.adminChatHistory = catchAsync(async (req, res, next) => {
//   res.status(200).json({
//     success: true,
//   });
// });
