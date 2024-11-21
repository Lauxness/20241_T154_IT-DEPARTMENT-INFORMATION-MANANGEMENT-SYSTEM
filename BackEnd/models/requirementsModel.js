const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentRequirementSchema = new Schema(
  {
    requirementName: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
    },
    fileDownloadLink: {
      type: String,
      required: true,
    },
    fileViewLink: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileThumbnailLink: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("studentRequirement", studentRequirementSchema);
