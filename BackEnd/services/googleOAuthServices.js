const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();

async function getUserData(access_token) {
  const respone = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  const data = await respone.json();
  console.log(data);
}
async function getToken(req, res) {
  console.log("123123");
  const code = req.query.code;
  try {
    const redirectUrl = "http://localhost:3000/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const res = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(res.tokens);
    console.log("Tokens Acquired");
    const user = oAuth2Client.credentials;
    console.log(user);

    await getUserData(user.access_token);
  } catch (err) {
    console.log("Cant sign in");
  }
}
module.exports = getToken;
