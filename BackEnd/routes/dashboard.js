const express = require("express");
const adminRoute = require("./admin");
const router = express.Router();
const {
  getDashboard,
  getEnrollmentOfficer,
  generateReport,
} = require("../services/dashboardServices");
router.get("/", (req, res) => {
  getDashboard(req, res);
});
router.get("/enrollment_officer", (req, res) => {
  getEnrollmentOfficer(req, res);
});
router.get("/generate_report", generateReport);

router.use("/enrollment_officer", adminRoute);

module.exports = router;
