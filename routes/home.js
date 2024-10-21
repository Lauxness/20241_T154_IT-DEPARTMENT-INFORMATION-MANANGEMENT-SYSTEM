const express = require("express");
const router = express.Router();
const {
  homePage,
  addStudent,
  searchStudent,
} = require("../services/homeServices");

router.get("/", (req, res) => {
  homePage(req, res);
});
router.post("/students/add", (req, res) => {
  addStudent(req, res);
});
router.get("/search/:parameter", (req, res) => {
  searchStudent(req, res);
});

module.exports = router;
