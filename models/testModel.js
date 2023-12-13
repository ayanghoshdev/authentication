const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Test should have a name"],
  },
  description: {
    type: String,
    required: [true, "Test should have description"],
  },
  price: {
    type: Number,
    required: [true, "Test should have price"],
  },
  location: {
    type: String,
    required: [true, "Test should have a location"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
});

// TestSchema.pre(/^find/, function (next) {
//   this.populate("user");

// next();
// });

module.exports = mongoose.model("Test", TestSchema);
