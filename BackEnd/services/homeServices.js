const Students = require("../models/studentModel");
const homePage = async (req, res) => {
  const allStudent = await Students.find();
  res.status(200).json(allStudent);
};
const addStudent = async (req, res) => {
  const newStudent = req.body;
  const { studentId, studentName } = newStudent;
  const existingStudent = await Students.findOne({ studentId });
  if (!existingStudent) {
    const addedStudent = await Students.create(newStudent);
    res.status(201).json(addedStudent);
  } else {
    res.status(407).json({ message: "Student already Exist" });
  }
};
const searchStudent = (req, res) => {
  const parameter = req.params.parameter;
  res.send(console.log(parameter));
};

module.exports = { homePage, addStudent, searchStudent };
