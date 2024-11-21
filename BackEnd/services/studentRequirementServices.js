const fs = require("fs");
const Student = require("../models/studentModel");
const studentRequirement = require("../models/requirementsModel");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const path = require("path");
dotenv.config();

const REFRESH_TOKEN_FOR_DRIVE = process.env.REFRESH_TOKEN_FOR_DRIVE;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN_FOR_DRIVE });
const drive = google.drive({
  version: "v3",
  auth: oAuth2Client,
});

const viewRequirements = (req, res, student) => {
  res.send(console.log(id));
};
const uploadImage = async (req, res) => {
  const studentId = req.params.id;
  const requirementName = req.body.requirementName;
  console.log(req.body.requirementName);
  const student = await Student.findById(studentId);
  if (!student) {
    console.log("Student not found");
    return res.status(404).json({ message: "Student not found" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filepath = req.file.path;

  try {
    const response = await drive.files.create({
      requestBody: {
        name: requirementName,
        mimeType: req.file.mimetype,
        parents: ["1esoPpkME2jENriphrZ6AFbO3UESm1Dzk"],
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(filepath),
      },
    });

    console.log("File uploaded successfully:", response.data);

    const fileData = await generatePublicUrlForFile(response.data.id);
    const { webContentLink, webViewLink, thumbnailLink } = fileData;

    const requirement = {
      requirementName: requirementName,
      fileId: response.data.id,
      fileName: response.data.name,
      fileDownloadLink: webContentLink,
      fileViewLink: webViewLink,
      fileThumbnailLink: thumbnailLink,
      mimeType: response.data.mimeType,
    };
    console.log(thumbnailLink);
    const uploadedRequirement = await studentRequirement.create(requirement);

    student.requirements.push(uploadedRequirement._id);
    await student.save();

    res.status(200).json({ message: "File has been uploaded!" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .send(
        "Error uploading file: " +
          (error.response ? error.response.data.error.message : error.message)
      );
  } finally {
    fs.unlinkSync(filepath);
  }
};

const generatePublicUrlForFile = async (fileID) => {
  try {
    await drive.permissions.create({
      fileId: fileID,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileID,
      fields: "webViewLink, webContentLink, thumbnailLink",
    });

    return result.data;
  } catch (error) {
    console.error("Error generating public URL:", error);
    throw error;
  }
};

module.exports = {
  uploadImage,
};

const updateRequirement = (req, res) => {
  const id = req.params.id;
  res.send(console.log(id));
};
const viewRequirementImage = (req, res) => {
  const name = req.params.name;
  res.send(console.log(name));
};
const deleteRequirementImage = (req, res) => {
  const name = req.params.name;
  res.send(console.log(name));
};

module.exports = {
  viewRequirements,
  uploadImage,
  updateRequirement,
  viewRequirementImage,
  deleteRequirementImage,
};
