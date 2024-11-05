const express = require("express");
const router = express.Router();
const {
  viewRequirements,
  uploadImage,
  updateRequirement,
  viewRequirementImage,
  deleteRequirementImage,
} = require("../services/studentRequirementServices");

router.get("/", (req, res) => {
  viewRequirements(req, res, "Sample");
});
router.get("/upload_image", (req, res) => {
  uploadImage(req, res);
});
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
