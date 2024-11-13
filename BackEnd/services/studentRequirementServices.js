const path = require("path");
const fs = require("fs");
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
const { google } = require("googleapis");
dotenv.config();

const viewRequirements = (req, res, student) => {
  res.send(console.log(id));
};
const uploadImage = async (req, res) => {
  // utils/uploadFileToDrive.js
  const redirectURI = "http://localhost:8000/index/login/oauth";
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectURI
  );
  const refresh_token = req.session.tokens.refresh_token;
  console.log(refresh_token);
  await oAuth2Client.setCredentials(refresh_token);
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  const fileMetadata = {
    name: "testfile.txt",
    mimeType: "text/plain",
  };
  const media = {
    mimeType: "text/plain",
    body: "Hello, this is a test file uploaded to Google Drive!",
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });
    console.log("File uploaded with ID:", file.data.id);
    res.json({ fileId: file.data.id });
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    res.status(500).send("Failed to upload file to Google Drive");
  }
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
