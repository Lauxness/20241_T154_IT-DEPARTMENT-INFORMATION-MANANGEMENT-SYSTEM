const dotenv = require("dotenv");
const notifications = require("../models/notificationModel");
const Student = require("../models/studentModel");
const Semester = require("../models/schoolYearModel");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
dotenv.config();
const TeleSignSDK = require("telesignsdk");

const TELESIGN_CUSTOMER_ID = process.env.TELESIGN_CUSTOMER_ID;
const APIKEY = process.env.APIKEY;
const phone_number = process.env.TEST_NUMS;
const client = new TeleSignSDK(TELESIGN_CUSTOMER_ID, APIKEY);

const getNotifications = async (req, res) => {
  const id = req.user.id;
  console.log(id);
  if (!id) {
    return res.status(400).json({ message: "Missing officer ID" });
  }
  try {
    const notification = await notifications.find({ reciever: id });

    console.log(notification);
    return res.status(200).json(notification);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const notifyStudent = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const student = await Student.findById(id).populate("requirements");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.status === "Complete") {
      return res
        .status(400)
        .json({ message: "Student have complete requirements" });
    }
    console.log("Student Details:", student);
    console.log("Student Requirements:", student.requirements);
    const defaultRequirements = [
      "Certificate of Good Moral",
      "Vaccination Card",
      "Report Card (FORM 138)",
      "PSA Birth Certificate",
      "BUKSU-CAT Result of Rating",
    ];
    const missingRequirements = defaultRequirements.filter(
      (req) => !student.requirements.some((r) => r.requirementName === req)
    );
    const message = `Requirements reminder.`;
    const messageType = "ARN";

    await sendEmail(student.email, missingRequirements, student.studentName);
    client.sms.message(smsCallBack, phone_number, message, messageType);
    return res.status(200).json({ message: "Student has been notified!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const notifyAllStudents = async (req, res) => {
  try {
    const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
    const currentTime = Date.now();

    const semesterStudents = await Semester.find()
      .sort({ createdAt: -1 })
      .populate("students");

    if (!semesterStudents) {
      return res.status(404).json({ message: "No student notified!" });
    }

    const students = semesterStudents[0].students;

    const activeStudents = students.filter((student) => !student.isArchived);

    let notifiedCount = 0;

    for (const student of Object.values(activeStudents)) {
      const defaultRequirements = [
        "Certificate of Good Moral",
        "Vaccination Card",
        "Report Card (FORM 138)",
        "PSA Birth Certificate",
        "BUKSU-CAT Result of Rating",
      ];

      const missingRequirements = defaultRequirements.filter(
        (req) => !student.requirements.some((r) => r.requirementName === req)
      );

      const lastNotified = student.lastNotified || 0;

      if (
        missingRequirements.length > 0 &&
        currentTime - lastNotified > fifteenDaysInMs
      ) {
        try {
          await sendEmail(
            student.email,
            missingRequirements,
            student.studentName
          );

          console.log(`Email sent to ${student.studentName}`);

          student.lastNotified = currentTime;
          await student.save();
          instance;

          notifiedCount++;
        } catch (error) {
          console.error(
            `Error sending email to ${student.studentName}: ${error}`
          );
        }
      }
    }

    if (notifiedCount > 0) {
      return res.status(200).json({
        message: `${notifiedCount} student(s) have been notified!`,
      });
    } else {
      return res.status(200).json({
        message:
          "No students were notified. All are up-to-date or within the timeout period.",
      });
    }
  } catch (error) {
    console.error("Error notifying students:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const smsCallBack = (error, responseBody) => {
  if (error) {
    console.log(error);
  } else {
    console.log(responseBody);
  }
};
const sendEmail = async (toEmail, missingRequirements, name) => {
  const REFRESH_TOKEN_FOR_EMAIL = process.env.REFRESH_TOKEN_FOR_DRIVE;
  const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
  const fromEmail = process.env.ACC_EMAIL_SENDER;
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
      subject: "Remiders for your missing requirements!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p style="font-size: 16px;">Good day,</p>
    
          <p style="font-size: 16px;">
           Hello ${name}, We are reminding you for your missing requirements: <strong>${missingRequirements}</strong>. You are required to pass it as soon as possible.
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

module.exports = { notifyStudent, getNotifications, notifyAllStudents };
