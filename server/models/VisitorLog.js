const mongoose = require("mongoose");

const visitorLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = anonymous visitor
    },
    sessionStart: {
      type: Date,
      required: true,
    },
    sessionEnd: {
      type: Date,
      default: null,
    },
    durationSeconds: {
      type: Number,
      default: null, // calculated when session ends
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitorLog", visitorLogSchema);