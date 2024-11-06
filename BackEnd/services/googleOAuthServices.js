/* const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken

const dotenv = require("dotenv");
dotenv.config();

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  console.log(data);
  return data; // Return user data for JWT payload
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

    oAuth2Client.setCredentials(tokens);
    console.log("Tokens Acquired: ", tokens);
    const userInfo = await getUserData(tokens.access_token);

    const payload = {
      id: userInfo.sub,
      name: userInfo.name,
      picture: userInfo.picture,
      email: userInfo.email,
    };
    console.log(payload);
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send JWT in response
     res.redirect(`http://localhost:5173/home?token=${jwtToken}`); 
    res.json(jwtToken);
  } catch (err) {
    console.error("Error signing in:", err);
    res.redirect("http://localhost:5173?error=signin_failed");
  }
}

module.exports = getToken;
 */
const Accounts = require("../models/accountsModel");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../utils/googleClient");
const message = require("./messageStudentServices");
/* const User = require("../models/userModel"); */

/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
  const code = req.query.code;
  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { id, email, name, picture } = userRes.data;
    const emailAddress = email;
    const currentUser = await Accounts.findOne({ emailAddress });
    if (!currentUser) {
      return res.status(404).json({ message: "Account is not Registered" });
    } else {
      currentUser.googleId = id;
      currentUser.name = name;
      currentUser.emailAddress = email;
      currentUser.profilePicture = picture;
      currentUser.accessToken = googleRes.tokens.access_token;
      currentUser.refreshToken = googleRes.tokens.refresh_token;
      currentUser.role = currentUser.role;
      currentUser.assignedYear = currentUser.assignedYear;
      const updatedUser = await currentUser.save();
      const user = {
        name: updatedUser.name,
        emailAddress: updatedUser.emailAddress,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
        assignedYear: updatedUser.assignedYear,
      };

      console.log(updatedUser);
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
      });
      res.status(200).json({
        message: "success",
        token,
        user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
