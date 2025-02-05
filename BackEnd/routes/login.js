const express = require("express");
const router = express.Router();
const captchaRoute = require("./captcha");
const { googleAuth } = require("../services/googleOAuthServices");

router.use("/verifyCaptcha", captchaRoute);
router.get("/login/oauth", googleAuth);

module.exports = router;
