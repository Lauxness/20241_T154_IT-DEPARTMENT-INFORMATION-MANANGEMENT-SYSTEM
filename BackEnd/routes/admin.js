const express = require("express");
const {
  addEnrollmentOfficer,
  deleteEnrollmentOfficer,
  updateEnrollmentOfficer,
} = require("../services/adminServices");
const router = express.Router();

router.post("/add", async (req, res) => {
  await addEnrollmentOfficer(req, res);
});
router.delete("/:id", (req, res) => {
  deleteEnrollmentOfficer(req, res);
});
router.patch("/:id", (req, res) => {
  updateEnrollmentOfficer(req, res);
});

module.exports = router;
