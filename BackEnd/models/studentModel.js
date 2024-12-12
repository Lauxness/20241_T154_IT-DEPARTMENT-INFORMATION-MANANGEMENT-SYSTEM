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
    semesterGWA: {
      type: String,
    },
    lastNotified: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Regular", "Irregular", "LOA"],
      default: "Regular",
    },
    isComplete: {
      type: Boolean,
      default: false,
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
