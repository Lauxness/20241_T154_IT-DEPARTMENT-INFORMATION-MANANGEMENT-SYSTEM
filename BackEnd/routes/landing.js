const express = require("express");
const router = express.Router();
const { landingPage, login } = require("../services/landingServices");
router.get("/", (req, res) => {
  landingPage(req, res);
});
router.post("/login", (req, res) => {
  login(req, res);
});

module.exports = router;
