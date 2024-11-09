const Student = require("../models/studentModel");
const getAllStudents = (req, res) => {
  res.send(console.log("get all student"));
};
const selectStudent = (req, res) => {
  const id = req.params.id;
  res.send(console.log(id));
};
const updateStudent = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Send success response with updated student data
    res
      .status(200)
      .json({ message: "Student updated successfully", data: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res
      .status(500)
      .json({ message: "Failed to update student", error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    const user = await Student.findByIdAndDelete(userId);
    if (user) {
      res.status(200).json({ message: "User deleted successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  getAllStudents,
  selectStudent,
  updateStudent,
  deleteStudent,
};
