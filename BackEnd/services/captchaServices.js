const request = require("request");
const dotenv = require("dotenv");

dotenv.config();

const verifyCaptcha = (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === "" ||
    req.body.captcha === null
  ) {
    return res.json({ success: false, msg: "Please Select Captcha" });
  }
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`;
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);

    if (body.success !== undefined && !body.success) {
      return res.json({ success: false, msg: "Failed captcha verification" });
    }
    return (
      res.json({ success: true, msg: "Captcha Passed" }), res.send("asdfsadf")
    );
  });
};
module.exports = verifyCaptcha;
