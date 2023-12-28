const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

// Function to check existing conversation with user and participant/admin
const checkExistingConversation = async (userId1, userId2) => {
  return await Conversation.findOne({
    participants: {
      $all: [
        { $elemMatch: { userId: userId1 } },
        { $elemMatch: { userId: userId2 } },
      ],
    },
    $expr: { $eq: [{ $size: "$participants" }, 2] }, // Ensure exactly two participants
  });
};

// Private message
exports.startConversation = catchAsync(async (req, res, next) => {
  //1. get the participant from request
  const { participant } = req.body;

  //2. if no participant send by user then participant will be admin
  if (!participant) {
    const admin = await User.findOne({ role: "admin" });

    // check any conversation is already exits with the admin
    const existingConversation = await checkExistingConversation(
      req.user._id,
      admin._id
    );
    // if any any conversation exist with admin then return it else create one
    if (existingConversation) {
      return res.status(200).json({
        success: true,
        conversation: existingConversation,
      });
    } else {
      const newConversation = await Conversation.create({
        participants: [
          { userId: req.user._id, userName: req.user.name },
          { userId: admin._id, userName: admin.name },
        ],
        messages: [],
      });
      res.status(200).json({
        success: true,
        conversation: newConversation,
      });
    }
  } else {
    //3. If participant send by user then check user is exist or not

    // validate paritcipant's userId
    if (!mongoose.Types.ObjectId.isValid(participant.userId))
      return next(new AppError("!Invalid user id for participant.", 400));

    const existingUser = await User.findById(participant.userId);

    // if no user exists with participant's userId then return Error
    if (!existingUser)
      return next(new AppError("No user found with the participantId!."));

    //4. Check user had already a conversation with the perticipant or not
    const existingConversation = await checkExistingConversation(
      req.user._id,
      existingUser._id
    );

    // if already had a conversation then return it else create one
    if (existingConversation) {
      return res.status(200).json({
        success: true,
        conversation: existingConversation,
      });
    } else {
      // create a new conversation with the participant
      const newConversation = await Conversation.create({
        participants: [
          { userId: req.user._id, userName: req.user.name },
          {
            userId: existingUser._id,
            userName: existingUser.name,
          },
        ],
        messages: [],
      });
      res.status(200).json({
        success: true,
        conversation: newConversation,
      });
    }
  }
});

// Send messages
exports.sendMessages = catchAsync(async (req, res, next) => {
  const { conversationId, message } = req.body;
  // validate paritcipant's userId
  if (!mongoose.Types.ObjectId.isValid(conversationId))
    return next(new AppError("!Invalid conversationId.", 400));

  if (!message) return next(new AppError("!Message was not provied."));

  //1. Find the conversation and create the message
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) return next(new AppError("!No conversation found.", 404));

  //2. Make the user "sender" who requested and other participant to receiver
  const [receiver] = await conversation.participants.filter((participant) => {
    const participantId = JSON.stringify(participant.userId);
    const userId = JSON.stringify(req.user._id);

    return participantId !== userId;
  });

  const newMessage = {
    senderId: req.user._id,
    receiverId: receiver.userId,
    content: message,
    timeStamp: Date.now(),
  };

  conversation.messages.push(newMessage);
  const updatedConversation = await conversation.save();

  const io = req.app.get("socketio"); // getting the io
  io.sockets.in(conversationId).emit("chat-message", newMessage);

  res.status(200).json({
    success: true,
    message: "Message sent successfully.",
    conversation: updatedConversation,
  });
});
