const express = require("express");
const router = express.Router();
const { landingPage, login } = require("../services/landingServices");
const captchaRoute = require("./captcha");
const googleOAuthRoute = require("./googleOAuth");

router.get("/", (req, res) => {
  landingPage(req, res);
});
router.use("/verifyCaptcha", captchaRoute);
router.use("/login", googleOAuthRoute);

module.exports = router;
