const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const activitySchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    officer: {
      type: Schema.Types.ObjectId,
      ref: "Accounts",
    },
    operation: {
      type: String,
      required: true,
      enum: ["add", "update", "archive", "unarchive", "upload", "delete"],
    },
    details: { type: String, required: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("activityLog", activitySchema);
