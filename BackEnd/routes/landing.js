const express = require("express");
const router = express.Router();
const { landingPage, login } = require("../services/landingServices");
const captchaRoute = require("./captcha");

router.get("/", (req, res) => {
  landingPage(req, res);
});
router.use("/verifyCaptcha", captchaRoute);
router.post("/login", (req, res) => {
  login(req, res);
});

module.exports = router;
