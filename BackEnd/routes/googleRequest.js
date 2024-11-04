const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const { getGoogleUrl } = require("../services/googleRequestServices");

router.post("/request", async (req, res) => {
  const redirectURI = await getGoogleUrl();
  res.json({ url: redirectURI });
});

module.exports = router;
