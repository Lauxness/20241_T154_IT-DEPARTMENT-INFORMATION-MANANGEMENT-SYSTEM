const express = require("express");
const router = express.Router();
const {
  notifyStudent,
  getNotifications,
  notifyAllStudents,
} = require("../services/notificationServices");

router.post("/notify/:id", notifyStudent);
router.get("/", getNotifications);
router.post("/notify", notifyAllStudents);
module.exports = router;
