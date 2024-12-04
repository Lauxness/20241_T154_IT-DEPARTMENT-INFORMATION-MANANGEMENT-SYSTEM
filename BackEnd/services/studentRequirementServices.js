const fs = require("fs");
const Student = require("../models/studentModel");
const studentRequirement = require("../models/requirementsModel");
const activityLog = require("../models/activitiesModel");
const { unlockStudent } = require("../utils/unlockStudent");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { google } = require("googleapis");
const path = require("path");
dotenv.config();

const REFRESH_TOKEN_FOR_DRIVE = process.env.REFRESH_TOKEN_FOR_DRIVE;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
console.log(GOOGLE_CLIENT_SECRET);
const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN_FOR_DRIVE });
const drive = google.drive({
  version: "v3",
  auth: oAuth2Client,
});

const viewRequirements = (req, res) => {
  res.send(console.log(id));
};
const uploadImage = async (req, res) => {
  const studentId = req.params.id;
  const { id } = req.user; // Officer ID
  const requirementName = req.body.requirementName;
  console.log("Requirement Name:", requirementName);
  const filepath = req.file.path;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findById(studentId).session(session);
    if (!student) {
      throw new Error("Student not found");
    }

    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const response = await drive.files.create({
      requestBody: {
        name: requirementName,
        mimeType: req.file.mimetype,
        parents: [student.folderId],
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(filepath),
      },
    });

    console.log("File uploaded successfully:", response.data);
    const fileData = await generatePublicUrlForFile(response.data.id);
    const { webContentLink, webViewLink, thumbnailLink } = fileData;

    const requirement = {
      requirementName: requirementName,
      fileId: response.data.id,
      fileName: response.data.name,
      fileDownloadLink: webContentLink,
      fileViewLink: webViewLink,
      fileThumbnailLink: thumbnailLink,
      mimeType: response.data.mimeType,
    };

    const [uploadedRequirement] = await studentRequirement.insertMany(
      [requirement],
      { session }
    );

    student.requirements.push(uploadedRequirement._id);
    if (student.requirements.length >= 5) {
      student.status = "Complete";
    }

    await student.save({ session });
    const logEntry = {
      operation: "upload",
      student: student._id,
      officer: id,
      details: `Uploaded requirement: ${requirementName}`,
    };
    await activityLog.create([logEntry], { session });
    await session.commitTransaction();
    res.status(200).json({ message: "File has been uploaded!" });
  } catch (error) {
    await session.abortTransaction();

    console.error("Error uploading file:", error);
    res.status(500).send({
      message: `Error uploading file: ${
        error.response ? error.response.data.error.message : error.message
      }`,
    });
  } finally {
    session.endSession();
    try {
      fs.unlinkSync(filepath);
    } catch (unlinkError) {
      console.error("Error removing file:", unlinkError);
    }
    await unlockStudent(studentId);
  }
};

const generatePublicUrlForFile = async (fileID) => {
  try {
    await drive.permissions.create({
      fileId: fileID,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileID,
      fields: "webViewLink, webContentLink, thumbnailLink",
    });

    return result.data;
  } catch (error) {
    console.error("Error generating public URL:", error);
    throw error;
  }
};
const updateRequirement = async (req, res) => {
  const requirementId = req.params.reqId;
  const studentId = req.params.studentId;
  const { id } = req.user;
  const requirementName = req.body.requirementName;
  console.log("Requirement Id", requirementId);
  console.log("Student Id", requirementName);
  const filepath = req.file.path;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const requirement = await studentRequirement.findById({
      _id: requirementId,
    });
    console.log(requirement.fileId);
    if (!requirement) {
      return res.status(404).json({ message: "Requirement not found" });
    }
    const student = await Student.findById({ _id: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(student);
    const response = await drive.files.create({
      requestBody: {
        name: requirementName,
        mimeType: req.file.mimetype,
        parents: [student.folderId],
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(filepath),
      },
    });
    const fileData = await generatePublicUrlForFile(response.data.id);
    const { webContentLink, webViewLink, thumbnailLink } = fileData;

    const newRequirement = {
      requirementName: requirementName,
      fileId: response.data.id,
      fileName: response.data.name,
      fileDownloadLink: webContentLink,
      fileViewLink: webViewLink,
      fileThumbnailLink: thumbnailLink,
      mimeType: response.data.mimeType,
    };
    await studentRequirement.findByIdAndUpdate(
      requirementId,
      newRequirement,
      {
        new: true,
      },
      { session }
    );
    const fileId = requirement.fileId;
    if (deleteFromDrive(fileId)) {
      const logEntry = {
        operation: "update",
        student: student._id,
        officer: id,
        details: `Updated requirement: ${requirementName}`,
      };
      await activityLog.create([logEntry], { session });
      await session.commitTransaction();
      return res
        .status(200)
        .json({ message: "Requirement file has been successfully updated!" });
    }
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return res.status(501).json({ message: "Internal Server Error" });
  } finally {
    await unlockStudent(id);
    session.endSession();
    fs.unlinkSync(filepath);
  }
};

const deleteRequirementImage = async (req, res) => {
  const studentID = req.params.id;
  const requirementId = req.params.reqId;
  console.log(requirementId);
  const { id } = req.user;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findById(studentID).session(session);
    if (!student) {
      return res.status(404).json({ message: "Student not found!" });
    }
    await Student.updateOne(
      { _id: studentID },
      { $pull: { requirements: requirementId } },
      { session }
    );
    const requirement = await studentRequirement.findByIdAndDelete(
      requirementId,
      { session }
    );
    if (!requirement) {
      return res.status(404).json({ message: "Requirement Not Found!" });
    }
    const driveDeleteSuccess = deleteFromDrive(requirement.fileId);

    if (!driveDeleteSuccess) {
      throw new Error("Failed to delete file from drive.");
    }
    const updatedStudent = await Student.findById(studentID)
      .populate("requirements")
      .session(session);
    if (updatedStudent.requirements.length < 5) {
      updatedStudent.status = "Incomplete";
      await updatedStudent.save({ session });
    }
    const logEntry = {
      operation: "delete",
      student: student._id,
      officer: id,
      details: `Deleted requirement: ${requirement.requirementName}`,
    };
    await activityLog.create([logEntry], { session });
    await session.commitTransaction();
    res
      .status(200)
      .json({ message: "Requirement has been deleted and status updated!" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error during requirement deletion:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  } finally {
    await unlockStudent(studentID);
    session.endSession();
  }
};

const deleteFromDrive = async (fileId) => {
  try {
    await drive.files.delete({
      fileId: fileId,
    });
    console.log(`File with ID: ${fileId} deleted successfully.`);
    return true;
  } catch (err) {
    console.error("Error deleting file:", err);
    return false;
  }
};

module.exports = {
  viewRequirements,
  uploadImage,
  updateRequirement,
  deleteRequirementImage,
};
