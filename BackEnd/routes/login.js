const express = require("express");
const router = express.Router();
const captchaRoute = require("./captcha");
const googleOAuthRoute = require("./googleOAuth");

router.use("/verifyCaptcha", captchaRoute);
router.use("/login", googleOAuthRoute);

module.exports = router;
