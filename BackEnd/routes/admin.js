const express = require("express");
const {
  addEnrollmentOfficer,
  deleteEnrollmentOfficer,
  updateEnrollmentOfficer,
  searchEnrollmentOfficer,
} = require("../services/adminServices");
const router = express.Router();

router.post("/add", async (req, res) => {
  addEnrollmentOfficer(req, res);
});
router.delete("/:id", (req, res) => {
  deleteEnrollmentOfficer(req, res);
});
router.get("/:id", (req, res) => {
  searchEnrollmentOfficer(req, res);
});
router.patch("/:id", (req, res) => {
  updateEnrollmentOfficer(req, res);
});

module.exports = router;
