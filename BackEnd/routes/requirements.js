const express = require("express");
const router = express.Router();
const {
  viewRequirements,
  uploadImage,
  updateRequirement,
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
router.patch(
  "/:studentId/:reqId",
  multerConfig.upload.single("requirement"),
  (req, res) => {
    updateRequirement(req, res);
  }
);

router.delete("/remove_image/:id/:reqId", (req, res) => {
  deleteRequirementImage(req, res);
});

module.exports = router;
