const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  console.log(data);
}
async function getToken(req, res) {
  const code = req.query.code;
  try {
    const redirectURI = "http://localhost:8000/index/login/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURI
    );
    const { tokens } = await oAuth2Client.getToken(code);
    req.session.tokens = tokens;
    console.log("This is the session token", req.session.tokens);
    await oAuth2Client.setCredentials(tokens);
    console.log("Tokens Acquired: ", tokens);
    const user = oAuth2Client.credentials;
    /*  console.log(user); */
    await getUserData(user.access_token);
    res.cookie("session_id", "123456789", { maxAge: 3600000, httpOnly: true }); // Set a cookie
    res.json({ message: "Tokens acquired and cookie set!" });
  } catch (err) {
    console.log("Cant sign in");
    res.end();
  }
}

module.exports = getToken;
