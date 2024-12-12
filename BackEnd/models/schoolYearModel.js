const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schoolYearSemesterSchema = new Schema(
  {
    schoolYear: { type: String, required: true },
    semester: { type: String, required: true, enum: ["1st", "2nd"] },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("schoolYear", schoolYearSemesterSchema);
