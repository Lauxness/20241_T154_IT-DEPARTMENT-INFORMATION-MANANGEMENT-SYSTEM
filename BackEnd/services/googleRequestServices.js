const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
dotenv.config();

async function getGoogleUrl(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectURI = "http://localhost:8000/index/login/oauth";

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectURI
  );
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile openid",
      "https://www.googleapis.com/auth/drive",
    ],
    prompt: "consent",
  });
  return authorizeUrl;
}

module.exports.getGoogleUrl = getGoogleUrl;
