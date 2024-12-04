const Student = require("../models/studentModel");
const mongoose = require("mongoose");
const activityLog = require("../models/activitiesModel");
const { unlockStudent } = require("../utils/unlockStudent");
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isArchived: true });
    return res.status(200).json(students);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};

const selectStudent = async (req, res) => {
  const id = req.params.id;
  try {
    const currentTime = new Date();

    const student = await Student.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { isLocked: { $ne: true } },
          { lockExpiresAt: { $lte: currentTime } },
        ],
      },
      {
        isLocked: true,
        lockExpiresAt: new Date(currentTime.getTime() + 1 * 60 * 1000),
      },
      { new: true }
    ).populate("requirements");

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found or currently in use." });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const updatedData = req.body;
  const officerId = req.user.id; // Assuming req.user contains the officer's details
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updatedData,
      { new: true, session } // Use session for transaction
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Updated Student:", updatedStudent);

    const logEntry = {
      operation: "update",
      student: updatedStudent._id,
      officer: officerId,
      details: "Updated student information",
    };

    await activityLog.create([logEntry], { session });

    await session.commitTransaction();
    res.status(200).json({
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating student:", error);
    res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

const archiveStudent = async (req, res) => {
  const userId = req.params.id;
  const { id: officerId } = req.user;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await Student.findByIdAndUpdate(
      userId,
      { isArchived: true },
      { new: true, session }
    );

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Student not found" });
    }

    const logEntry = {
      operation: "archive",
      student: user._id,
      officer: officerId,
      details: "Archived student",
    };
    await activityLog.create([logEntry], { session });
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Student has been moved to Archives.", user });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error archiving student:", error);
    res.status(500).json({ message: "Error archiving student.", error });
  }
};

const restoreStudent = async (req, res) => {
  const userId = req.params.id;
  const { id: officerId } = req.user;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findByIdAndUpdate(
      userId,
      { isArchived: false },
      { new: true, session }
    );

    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Student not found!" });
    }
    const logEntry = {
      operation: "unarchive",
      student: student._id,
      officer: officerId,
      details: "Restored student from archives",
    };

    await activityLog.create([logEntry], { session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Student has been restored from archives." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error restoring student:", error);
    res.status(500).json({ message: "Error restoring student.", error });
  }
};

const unlock = async (req, res) => {
  const id = req.params.id;
  console.log("asdfasdfsafsdf");
  try {
    const result = await unlockStudent(id);

    if (result) {
      return res.status(204);
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  unlock,
  restoreStudent,
  getAllStudents,
  selectStudent,
  updateStudent,
  archiveStudent,
};
