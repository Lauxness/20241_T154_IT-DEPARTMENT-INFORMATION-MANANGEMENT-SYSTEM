const dotenv = require("dotenv");
dotenv.config();
const TeleSignSDK = require("telesignsdk");

const TELESIGN_CUSTOMER_ID = process.env.TELESIGN_CUSTOMER_ID;
const APIKEY = process.env.APIKEY;
const phone_number = process.env.TEST_NUMS;
const client = new TeleSignSDK(TELESIGN_CUSTOMER_ID, APIKEY);

const notifyStudent = async (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: "Message content is required" });
  }
  const message = req.body.message;
  console.log(message);
  const messageType = "ARN";
  try {
    client.sms.message(smsCallBack, phone_number, message, messageType);
  } catch (error) {
    console.log(error);
  }
};

const smsCallBack = (error, responseBody) => {
  if (error) {
    console.log(error);
  } else {
    console.log(responseBody);
  }
};

module.exports = { notifyStudent };
