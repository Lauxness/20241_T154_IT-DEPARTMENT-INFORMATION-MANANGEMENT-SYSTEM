const path = require("path");
const fs = require("fs");
const { version } = require("os");
const { auth } = require("google-auth-library");

const viewRequirements = (req, res, student) => {
  res.send(console.log(id));
};
const uploadImage = (req, res) => {
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  const filePath = path.join(__dirname, "./testImage.png");
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
