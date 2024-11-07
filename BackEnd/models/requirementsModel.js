const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentRequirementSchema = new Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["Missing", "Submitted"],
      default: "Missing",
    },
    file: { type: mongoose.Schema.Types.ObjectId, ref: "RequirementsFile" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentRequirement", studentRequirementSchema);
