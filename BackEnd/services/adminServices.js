const Accounts = require("../models/accountsModel");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const addEnrollmentOfficer = async (req, res) => {
  const user = req.user;

  try {
    const accountInfo = await Accounts.findById(user.id);
    const fromEmail = accountInfo.emailAddress;
    const refresh_token = accountInfo.refreshToken;

    const {
      googleId,
      name,
      emailAddress,
      profilePicture,
      accessToken,
      refreshToken,
      role,
      assignedYear,
      assignedProgram,
    } = req.body;
    if (
      !(emailAddress && /^[a-zA-Z0-9._%+-]+@buksu\.edu\.ph$/.test(emailAddress))
    ) {
      return res.status(400).json({ message: "Email Address is not valid" });
    }

    const existingAccount = await Accounts.findOne({ emailAddress });

    if (existingAccount) {
      return res.status(400).json({
        message: "An account with this email address already exists.",
      });
    }
    const newAccount = await Accounts.create({
      googleId,
      name,
      emailAddress,
      profilePicture,
      accessToken,
      refreshToken,
      role,
      assignedYear,
      assignedProgram,
    });

    sendEmail(
      fromEmail,
      emailAddress,
      assignedProgram,
      assignedYear,
      refresh_token
    )
      .then(() => {
        res.status(200).json({
          message: "Officer added successfully",
        });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: "Account created but email failed to send." });
      });
  } catch (error) {
    console.error("Error in addEnrollmentOfficer:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const sendEmail = async (
  fromEmail,
  toEmail,
  assignedProgram,
  assignedYear,
  refresh_token
) => {
  const REFRESH_TOKEN_FOR_EMAIL = refresh_token;
  const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
  console.log(REFRESH_TOKEN_FOR_EMAIL);
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN_FOR_EMAIL,
  });
  const accessToken = await oauth2Client.getAccessToken();

  try {
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: fromEmail,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN_FOR_EMAIL,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "BukSU IT DEPARTMENT <no-reply@buksu.edu>",
      to: toEmail,
      subject: "You Have Been Assigned as an Enrollment Officer!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p style="font-size: 16px;">Good day,</p>
    
          <p style="font-size: 16px;">
            We are pleased to inform you that you have been assigned as an 
            <strong>Enrollment Officer</strong> in
            <strong>BukSU IT Department</strong> for 
            <span style="color: #0066cc; font-weight: bold;">${assignedProgram}</span>, 
            <span style="color: #0066cc; font-weight: bold;">${assignedYear}</span>.
          </p>
    
          <p style="font-size: 16px;">
            We appreciate your commitment and look forward to your valuable contributions!
          </p>
    
          <p style="font-size: 16px; margin-top: 30px;">
            <strong>Thank you,</strong><br />
            <span style="font-size: 16px; color: #555;">BukSU IT Department</span>
          </p>
    
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
    
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result);
    return result;
  } catch (err) {
    console.error("Failed to send email:", err.message);
    throw new Error("Email sending failed. Please try again.");
  }
};

const searchEnrollmentOfficer = async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      // Get a specific Enrollment Officer by ID
      const officer = await Accounts.findById(id);
      if (!officer) {
        return res
          .status(404)
          .json({ message: "Enrollment Officer not found" });
      }
      return res.status(200).json(officer);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
const deleteEnrollmentOfficer = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const deletedAccount = await Accounts.findByIdAndDelete(id);
    if (!deletedAccount) {
      return res.status(404).json({ message: "Enrollment Officer not found" });
    }
    res
      .status(200)
      .json({ message: "Enrollment Officer deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateEnrollmentOfficer = async (req, res) => {
  const updatedOfficer = req.body;
  console.log("REquest body", updatedOfficer.emailAddress);
  try {
    const enrollmentOfficer = await Accounts.findById(req.params.id);
    if (!enrollmentOfficer) {
      return res.status(404).json({ message: "Officer not found" });
    }
    enrollmentOfficer.googleId =
      req.body.googleId || enrollmentOfficer.googleId;
    enrollmentOfficer.name = req.body.name || enrollmentOfficer.name;
    enrollmentOfficer.emailAddress = req.body.emailAddress;
    enrollmentOfficer.accessToken =
      req.body.accessToken || enrollmentOfficer.accessToken;
    enrollmentOfficer.refreshToken =
      req.body.refreshToken || enrollmentOfficer.refreshToken;
    enrollmentOfficer.role = req.body.role || enrollmentOfficer.role;
    enrollmentOfficer.assignedYear =
      req.body.assignedYear || enrollmentOfficer.assignedYear;
    enrollmentOfficer.assignedProgram =
      req.body.assignedProgram || enrollmentOfficer.assignedProgram;

    const updatedEnrollmentOfficer = await enrollmentOfficer.save();
    res.status(200).json({ message: "Officer was successfully updated!" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addEnrollmentOfficer,
  deleteEnrollmentOfficer,
  updateEnrollmentOfficer,
  searchEnrollmentOfficer,
};
