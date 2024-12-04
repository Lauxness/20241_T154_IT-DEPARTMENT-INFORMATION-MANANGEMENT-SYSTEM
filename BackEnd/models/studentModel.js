const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    folderId: {
      type: String,
      default: "",
    },
    isArchived: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ["Complete", "Incomplete"],
      default: "Incomplete",
      required: true,
    },
    requirements: [
      {
        type: Schema.Types.ObjectId,
        ref: "studentRequirement",
      },
    ],
    lockExpiresAt: { type: Date, default: null },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
