const express = require("express");
const router = express.Router();
const message = require("../services/messageStudentServices");
router.post("/", (req, res) => {
  message(req, res);
});

module.exports = router;
