const Students = require("../models/studentModel");
const activityLog = require("../models/activitiesModel");
const Semester = require("../models/schoolYearModel");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const { find } = require("../models/accountsModel");
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
  /*   const role = req.user.role;
  const parameter = req.params.semester; */
  try {
    const semesterStudents = await Semester.find()
      .sort({ createdAt: -1 })
      .populate("students");
    if (!semesterStudents) {
      return res.status(404).json({ message: "Semester not found" });
    }
    const students = semesterStudents[0].students.filter(
      (student) => student.isArchived === false
    );
    return res.status(200).json([students, semesterStudents]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getStudentBySemester = async (req, res) => {
  console.log(req.user);
  const role = req.user.role;
  const parameter = req.params.parameter;
  const semester = parameter.split(" ")[1];
  const schoolyear = parameter.split(" ")[0];
  if (!semester || !schoolyear) {
    return res.status(400).json({ message: "Missing Parameters!" });
  }
  try {
    const semesterStudents = await Semester.find({
      semester: semester,
      schoolYear: schoolyear,
    }).populate("students");

    if (semesterStudents.length === 0) {
      return res.status(404).json({ message: "Semester not found" });
    }

    const students = semesterStudents[0].students.filter(
      (student) => student.isArchived === false
    );
    return res.status(200).json(students);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addStudent = async (req, res) => {
  const newStudent = req.body;
  const id = req.user.id;
  const { studentId, email, phoneNumber } = newStudent;
  if (!studentId || !/^220\d{7}$/.test(studentId)) {
    return res.status(400).json({ message: "Student ID is not valid" });
  }
  if (!email || !/^[a-zA-Z0-9._%+-]+@student\.buksu\.edu\.ph$/.test(email)) {
    return res.status(400).json({ message: "Email Address is not valid" });
  }
  if (!phoneNumber || !/^(?:\+63|63|0)9\d{9}$/.test(phoneNumber)) {
    return res.status(400).json({ message: "Phone number is not valid" });
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

    const currentSemester = await Semester.findOne()
      .sort({ createdAt: -1 })
      .session(session);

    if (!currentSemester) {
      throw new Error(
        "No active semester found. Please create a semester first."
      );
    }

    const folderId = await createFolder(studentId);

    const studentData = { ...newStudent, folderId };
    const addedStudent = await Students.create([studentData], { session });
    if (!addedStudent) {
      throw new Error("Failed to add student");
    }
    const studId = addedStudent[0]._id;

    currentSemester.students.push(studId);
    await currentSemester.save({ session });

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

    return res.status(200).json({
      message: "Student successfully added!",
    });
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

const addNewSemester = async (req, res) => {
  const { semester, schoolyear } = req.body;
  const role = req.user.role;
  if (role === "officer") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  const year = schoolyear.slice(-2);
  const updatedYear = (parseInt(year) + 1).toString(); // "35"
  const schoolYear = schoolyear + "-" + updatedYear;
  console.log(schoolYear);
  console.log(semester);
  if (!semester || !schoolYear) {
    return res.status(400).json({ message: "Semester and year are required." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const checkSemester = await Semester.find({
      semester: semester,
      schoolYear: schoolYear,
    });
    console.log(checkSemester.length);
    if (checkSemester.length != 0) {
      console.log("Semester Already Exists!");
      return res.status(409).json({ message: "Semester Already Exists!" });
    }

    const latestSemester = await Semester.findOne()
      .populate("students")
      .sort({ createdAt: -1 })
      .session(session);

    let studentData = [];
    if (latestSemester) {
      studentData = latestSemester.students.map((student) => ({
        studentName: student.studentName,
        studentId: student.studentId,
        email: student.email,
        program: student.program,
        year: student.year,
        folderId: student.folderId,
        phoneNumber: student.phoneNumber,
        semesterGWA: "",
        isArchived: student.isArchived,
        requirements: student.requirements,
      }));
    }
    const createdStudents = await Students.insertMany(studentData);

    const studentIds = createdStudents.map((student) => student._id);

    const newSemester = new Semester({
      schoolYear: schoolYear,
      semester: semester,
      students: studentIds,
    });
    await newSemester.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "New semester created successfully!",
      semester: newSemester,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating new semester:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const editSemester = async (req, res) => {
  const id = req.params.id;
  const role = req.user.role;
  if (role === "officer") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  const { schoolyear, semester } = req.body;
  const year = schoolyear.slice(-2);
  const updatedYear = (parseInt(year) + 1).toString(); // "35"
  const schoolYear = schoolyear + "-" + updatedYear;
  console.log(schoolYear, semester);
  try {
    const checkSemester = await Semester.find({
      schoolYear: schoolYear,
      semester: semester,
    });
    console.log(checkSemester);
    if (checkSemester.length > 0) {
      return res
        .status(409)
        .json({ message: "Semester you want to update has already exist." });
    }

    const updatedSemester = await Semester.findByIdAndUpdate(
      { _id: id },
      { schoolYear: schoolYear, semester: semester }
    );
    if (!updatedSemester) {
      return res.status(404).json({ message: "Semester Not found!" });
    }
    return res.status(200).json({ message: "Semester has been updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  homePage,
  addStudent,
  addNewSemester,
  editSemester,
  getStudentBySemester,
};
