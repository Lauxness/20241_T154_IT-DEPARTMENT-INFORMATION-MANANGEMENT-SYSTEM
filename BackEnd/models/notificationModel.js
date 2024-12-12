const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notification = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "Accounts",
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "Accounts",
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notifications", notification);
