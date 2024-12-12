const express = require("express");
const adminRoute = require("./admin");
const router = express.Router();
const {
  getDashboard,
  getEnrollmentOfficer,
  generateReport,
  addAdmin,
} = require("../services/dashboardServices");
const { generatePostInspectionPdf } = require("../utils/pdf");

router.get("/", (req, res) => {
  getDashboard(req, res);
});
router.get("/enrollment_officer", (req, res) => {
  getEnrollmentOfficer(req, res);
});
router.get("/generate_report", generatePostInspectionPdf);

router.use("/enrollment_officer", adminRoute);

module.exports = router;
