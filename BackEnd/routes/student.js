const express = require("express");
const requirementsRoute = require("./requirements");
const router = express.Router();
const {
  getAllStudents,
  selectStudent,
  updateStudent,
  deleteStudent,
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
  deleteStudent(req, res);
});
router.use("/requirements", requirementsRoute);

module.exports = router;
