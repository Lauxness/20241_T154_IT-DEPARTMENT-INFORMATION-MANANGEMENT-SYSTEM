const express = require("express");
const router = express.Router();
const {
  notifyStudent,
  viewInboxes,
  selectInbox,
  deleteInbox,
} = require("../services/notificationServices");

router.post("/notify", (req, res) => {
  notifyStudent(req, res);
});
router.get("/inbox", (req, res) => {
  viewInboxes(req, res);
});
router.get("/inbox/:id", (req, res) => {
  selectInbox(req, res);
});
router.delete("/inbox/:id", (req, res) => {
  deleteInbox(req, res);
});

module.exports = router;
