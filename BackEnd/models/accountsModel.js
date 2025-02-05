const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/Encryption");
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
      set: (value) => encrypt(value),
      get: (value) => decrypt(value),
    },
    refreshToken: {
      type: String,
      set: (value) => encrypt(value),
      get: (value) => decrypt(value),
    },
    role: {
      type: String,
      required: true,
    },
    assignedYear: {
      type: String,
    },
    assignedProgram: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
accountSchema.set("toJSON", { getters: true });

module.exports = mongoose.model("Accounts", accountSchema);
