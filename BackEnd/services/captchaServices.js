const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const verifyCaptcha = async (req, res) => {
  const { captcha } = req.body;

  if (!captcha) {
    return res
      .status(422)
      .json({ success: false, msg: "Please Select Captcha" });
  }

  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const verifyUrl = `https://google.com/recaptcha/api/siteverify`;
  try {
    const response = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: captcha,
        remoteip: req.socket.remoteAddress,
      },
    });

    if (response.data.success) {
      return res.status(200).json({ success: true, msg: "Captcha Passed" });
    } else {
      return res
        .status(422)
        .json({ success: false, msg: "Failed captcha verification" });
    }
  } catch (error) {
    console.error("Error verifying captcha:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

module.exports = verifyCaptcha;
