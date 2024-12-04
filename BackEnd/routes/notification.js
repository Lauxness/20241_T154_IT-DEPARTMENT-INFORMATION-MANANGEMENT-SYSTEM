const express = require("express");
const router = express.Router();
const { notifyStudent } = require("../services/notificationServices");

router.post("/notify", (req, res) => {
  notifyStudent(req, res);
});

module.exports = router;
