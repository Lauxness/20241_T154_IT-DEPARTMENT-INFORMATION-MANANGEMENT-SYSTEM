const express = require("express");
const router = express.Router();
const getToken = require("../services/googleOAuthServices");
const { OAuth2Client } = require("google-auth-library");
const { getGoogleUrl } = require("../services/googleRequestServices");

router.get("/oauth", async (req, res) => {
  await getToken(req, res);
});
router.post("/request", async (req, res) => {
  const redirectURI = await getGoogleUrl(req, res);
  res.json({ url: redirectURI });
});
module.exports = router;
