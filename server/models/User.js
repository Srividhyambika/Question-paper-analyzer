const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    dob: {
      type: String, // stored as YYYY-MM-DD string for easy comparison
      required: true,
    },
    password: {
      type: String,
      required: true, // stored as bcrypt hash — never plaintext
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    avatar: {
  type: String,
  default: null,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
