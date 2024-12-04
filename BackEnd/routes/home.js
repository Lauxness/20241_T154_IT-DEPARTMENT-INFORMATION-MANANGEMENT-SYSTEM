const express = require("express");
const router = express.Router();
const { homePage, addStudent } = require("../services/homeServices");

router.get("/", (req, res) => {
  homePage(req, res);
});
router.post("/students/add", (req, res) => {
  addStudent(req, res);
});

module.exports = router;
