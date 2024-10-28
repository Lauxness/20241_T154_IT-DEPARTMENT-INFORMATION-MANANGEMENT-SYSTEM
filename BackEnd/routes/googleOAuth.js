const express = require("express");
const router = express.Router();
const getToken = require("../services/googleOAuthServices");

router.get("/", async (req, res) => {
  await getToken(req, res);
});
module.exports = router;
