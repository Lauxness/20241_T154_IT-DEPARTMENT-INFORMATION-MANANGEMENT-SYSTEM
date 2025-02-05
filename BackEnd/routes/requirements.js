const express = require("express");
const router = express.Router();
const {
  uploadImage,
  updateRequirement,
  deleteRequirementImage,
} = require("../services/studentRequirementServices");
const multerConfig = require("../utils/multerConfig");

router.post(
  "/upload_image/:id",
  multerConfig.upload.single("requirement"),
  uploadImage
);
router.patch(
  "/:studentId/:reqId",
  multerConfig.upload.single("requirement"),
  updateRequirement
);
router.delete("/remove_image/:id/:reqId", deleteRequirementImage);

module.exports = router;
