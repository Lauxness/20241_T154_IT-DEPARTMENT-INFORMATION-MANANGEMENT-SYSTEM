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
    status: {
      type: String,
      enum: ["Complete", "Incomplete"],
      default: "Incomplete",
      required: true,
    },
    requirements: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentRequirement",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
