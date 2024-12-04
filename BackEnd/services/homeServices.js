const Students = require("../models/studentModel");
const activityLog = require("../models/activitiesModel");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const REFRESH_TOKEN_FOR_DRIVE = process.env.REFRESH_TOKEN_FOR_DRIVE;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN_FOR_DRIVE });
const drive = google.drive({
  version: "v3",
  auth: oAuth2Client,
});

const homePage = async (req, res) => {
  console.log(req.user);
  try {
    const students = await Students.find({ isArchived: false });
    return res.status(200).json(students);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};

const addStudent = async (req, res) => {
  const newStudent = req.body;
  const { id, name } = req.user;
  const { studentId, email } = newStudent;

  if (!email || !/^[a-zA-Z0-9._%+-]+@student\.buksu\.edu\.ph$/.test(email)) {
    console.log("Invalid email address detected:", email);
    return res.status(400).json({ message: "Email Address is not valid" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingStudent = await Students.findOne({ studentId }).session(
      session
    );
    if (existingStudent) {
      console.log("Conflict: Student already exists");
      return res.status(409).json({ message: "Student already exists" });
    }

    const folderId = await createFolder(studentId);

    const studentData = { ...newStudent, folderId };
    const addedStudent = await Students.create([studentData], { session }); //
    if (!addedStudent) {
      throw new Error("Failed to add student");
    }
    const logEntry = {
      operation: "add",
      student: addedStudent[0]._id,
      officer: id,
      details: "Added a new student",
    };
    const addedLog = await activityLog.create([logEntry], { session });
    if (!addedLog) {
      throw new Error("Failed to log the operation");
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "Student successfully added!" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function createFolder(folderName) {
  try {
    const fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: ["1esoPpkME2jENriphrZ6AFbO3UESm1Dzk"],
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });

    console.log(`Folder created with ID: ${response.data.id}`);
    return response.data.id;
  } catch (err) {
    console.error("Error creating folder:", err);
  }
}

module.exports = { homePage, addStudent };
