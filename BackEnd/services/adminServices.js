const Accounts = require("../models/accountsModel");
const nodemailer = require("nodemailer");
const notification = require("../models/notificationModel");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const addEnrollmentOfficer = async (req, res) => {
  const user = req.user;
  const role = req.user.role;
  if (role === "officer") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const accountInfo = await Accounts.findById(user.id).session(session);
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
    const emailTestRegex = new RegExp(process.env.EMAIL_TEST);
    if (emailAddress && emailTestRegex.test(emailAddress)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Email Address is not valid" });
    }

    const existingAccount = await Accounts.findOne({ emailAddress }).session(
      session
    );
    if (existingAccount && existingAccount.isActive === true) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        message: "An account with this email address already exists.",
      });
    }
    if (existingAccount && existingAccount.isActive === false) {
      existingAccount.isActive = true;
      await existingAccount.save();
      if (existingAccount.assignedProgram && existingAccount.assignedYear) {
        const newNotif = {
          reciever: existingAccount._id,
          message: `Hello there we would like to inform you that you are assigned for the program ${existingAccount.assignedProgram} ${existingAccount.assignedYear} students`,
        };
        await notification.create([newNotif], { session });
      }
    } else {
      const newAccount = await Accounts.create(
        [
          {
            googleId,
            name,
            emailAddress,
            profilePicture,
            accessToken,
            refreshToken,
            role,
            assignedYear,
            assignedProgram,
          },
        ],
        { session }
      );
      const newNotif = {
        reciever: newAccount[0]._id,
        message:
          "Welcome to our system Officer, Hope you`re doing well today> :>",
      };
      await notification.create([newNotif], { session });
      if (newAccount.assignedProgram && newAccount.assignedYear) {
        const newNotif = {
          reciever: newAccount._id,
          message: `Hello there we would like to inform you that you are assigned for the program ${newAccount.assignedProgram} ${newAccount.assignedYear} students`,
        };
        await notification.create([newNotif], { session });
      }
    }

    await sendEmail(
      fromEmail,
      emailAddress,
      assignedProgram,
      assignedYear,
      refresh_token
    );
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Officer added successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in addEnrollmentOfficer:", error.message);
    res.status(500).json({ messge: "Internal Server Error" });
  }
};

const sendEmail = async (toEmail, assignedProgram, assignedYear) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rojoreyanthony@gmail.com",
      pass: "dxxoxiqyefyytqsa",
    },
  });
  try {
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
  const role = req.user.role;
  if (role === "officer") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  const id = req.params.id;
  try {
    if (id) {
      const officer = await Accounts.findById(id);
      if (!officer) {
        return res
          .status(404)
          .json({ message: "Enrollment Officer not found" });
      }
      return res.status(200).json(officer);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};
const deleteEnrollmentOfficer = async (req, res) => {
  const id = req.params.id;
  const role = req.user.role;
  if (role === "officer") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  console.log(id);
  try {
    const deletedAccount = await Accounts.findByIdAndUpdate(id, {
      isActive: false,
    });
    if (!deletedAccount) {
      return res.status(404).json({ message: "Enrollment Officer not found" });
    }
    res
      .status(200)
      .json({ message: "Enrollment Officer Removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const updateEnrollmentOfficer = async (req, res) => {
  const role = req.user.role;
  if (role === "officer") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  const updatedOfficer = req.body;
  console.log("REquest body", updatedOfficer.emailAddress);
  try {
    const enrollmentOfficer = await Accounts.findById(req.params.id);
    if (!enrollmentOfficer) {
      return res.status(404).json({ message: "Officer not found" });
    }
    if (
      updatedOfficer.assignedProgram === enrollmentOfficer.assignedProgram &&
      updatedOfficer.assignedYear === enrollmentOfficer.assignedYear
    ) {
      return res.status(400).json({ message: "Nothing has been updated." });
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
    return res
      .status(200)
      .json({ message: "Officer was successfully updated!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};
const addAdmin = async (req, res) => {
  const role = req.user.role;
  const id = req.params.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  if (role === "officer") {
    session.abortTransaction();
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const officer = await Accounts.findByIdAndUpdate(
      id,
      { role: "admin" },
      { session }
    );
    if (!officer) {
      return res.status(404).json({ message: "Officer not found!" });
    }
    const newNotif = {
      reciever: officer._id,
      message: `Hello there we would like to inform you that you are assigned as a Admin in the system.`,
    };
    await notification.create([newNotif], { session });
    session.commitTransaction();
    return res.status(200).json({ message: "A new admin has been added!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addEnrollmentOfficer,
  deleteEnrollmentOfficer,
  updateEnrollmentOfficer,
  searchEnrollmentOfficer,
  addAdmin,
  sendEmail,
};
