const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = Schema({
  googleFileId: { type: String, required: true },
  name: { type: String },
  mimeType: { type: String },
  size: { type: Number },
  webViewLink: { type: String },
  thumbnailLink: { type: String },
  createdTime: { type: Date },
  modifiedTime: { type: Date },
});

module.exports = mongoose.model("RequirementsFile", fileSchema);
