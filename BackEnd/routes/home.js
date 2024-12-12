const express = require("express");
const router = express.Router();
const {
  homePage,
  addStudent,
  addNewSemester,
  getStudentBySemester,
  editSemester,
} = require("../services/homeServices");

router.get("/", (req, res) => {
  homePage(req, res);
});
router.post("/students/add", (req, res) => {
  addStudent(req, res);
});
router.get("/:parameter", getStudentBySemester);
router.post("/semester/add", (req, res) => {
  addNewSemester(req, res);
});
router.patch("/semester/:id", (req, res) => {
  editSemester(req, res);
});

module.exports = router;
