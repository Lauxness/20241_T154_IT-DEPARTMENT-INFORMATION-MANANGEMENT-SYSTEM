const express = require("express");
const router = express.Router();
const {
  viewRequirements,
  uploadImage,
  updateRequirement,
  viewRequirementImage,
  deleteRequirementImage,
} = require("../services/studentRequirementServices");
const multerConfig = require("../utils/multerConfig");

router.get("/", (req, res) => {
  viewRequirements(req, res, "Sample");
});
router.post(
  "/upload_image/:id",
  multerConfig.upload.single("requirement"),
  (req, res) => {
    console.log("adsfasfasf");
    uploadImage(req, res);
  }
);
router.patch("/:id", (req, res) => {
  updateRequirement(req, res);
});
router.get("/view_image/:name", (req, res) => {
  viewRequirementImage(req, res);
});
router.delete("/remove_image/:name", (req, res) => {
  deleteRequirementImage(req, res);
});

module.exports = router;
