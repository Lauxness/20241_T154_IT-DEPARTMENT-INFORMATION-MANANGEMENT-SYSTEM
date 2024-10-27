const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const router = express.Router();
const verifyCaptcha = require("../services/captchaServices");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
router.use(cors(corsOptions));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/", (req, res) => verifyCaptcha(req, res));

module.exports = router;
