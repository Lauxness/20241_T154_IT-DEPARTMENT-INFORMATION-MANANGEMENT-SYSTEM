const express = require("express");
const requirementsRoute = require("./requirements");
const router = express.Router();
const {
  unlock,
  restoreStudent,
  getAllStudents,
  selectStudent,
  updateStudent,
  archiveStudent,
} = require("../services/studentServices");

router.get("/", (req, res) => {
  getAllStudents(req, res);
});
router.get("/:id", (req, res) => {
  selectStudent(req, res);
});
router.patch("/:id", (req, res) => {
  updateStudent(req, res);
});
router.delete("/:id", (req, res) => {
  archiveStudent(req, res);
});
router.patch("/restore/:id", (req, res) => {
  restoreStudent(req, res);
});
router.patch("/unlock/:id", (req, res) => {
  unlock(req, res);
});

router.use("/requirements", requirementsRoute);

module.exports = router;
