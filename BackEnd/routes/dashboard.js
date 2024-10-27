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
router.post("/generate_report", (req, res) => {
  generateReport(req, res);
});

router.use("/enrollment_officer", adminRoute);
router.use("/logout", adminRoute);

module.exports = router;
