const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
});

module.exports = mongoose.model("notification", notificationSchema);
