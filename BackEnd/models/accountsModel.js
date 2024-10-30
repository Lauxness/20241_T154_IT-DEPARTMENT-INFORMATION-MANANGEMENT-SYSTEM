const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    googleId: {
      type: String,
    },
    name: {
      type: String,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    assignedYear: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accounts", accountSchema);
