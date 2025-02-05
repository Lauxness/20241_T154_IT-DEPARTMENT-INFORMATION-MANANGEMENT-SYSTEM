const Accounts = require("../models/accountsModel");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../utils/googleClient");

exports.googleAuth = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(404).json({ message: "Code not Found!" });
  }
  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    console.log(googleRes);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    console.log(userRes);
    const { id, email, name, picture } = userRes.data;
    const currentUser = await Accounts.findOne({ emailAddress: email });

    if (!currentUser) {
      return res.status(404).json({ message: "Account is not Registered" });
    }
    if (!currentUser.isActive) {
      return res.status(404).json({ message: "Account has been deactivated" });
    }
    currentUser.googleId = id;
    currentUser.name = name;
    currentUser.emailAddress = email;
    currentUser.profilePicture = picture;
    currentUser.accessToken = googleRes.tokens.access_token;
    currentUser.refreshToken = googleRes.tokens.refresh_token;

    const updatedUser = await currentUser.save();

    const userPayload = {
      id: updatedUser._id,
      googleId: updatedUser.googleId,
      name: updatedUser.name,
      emailAddress: updatedUser.emailAddress,
      profilePicture: updatedUser.profilePicture,
      role: updatedUser.role,
      assignedYear: updatedUser.assignedYear,
      assignedProgram: updatedUser.assignedProgram,
    };
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    res.status(200).json({
      message: "success",
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
