const Students = require("../models/studentModel");
const homePage = async (req, res) => {
  const allStudent = await Students.find();
  res.status(200).json(allStudent);
};
const addStudent = async (req, res) => {
  const newStudent = req.body;
  console.log(newStudent);
  const { studentId, studentName } = newStudent;
  try {
    const existingStudent = await Students.findOne({ studentId });
    if (!existingStudent) {
      const addedStudent = await Students.create(newStudent);
      console.log(addedStudent);
      res.status(201).json(addedStudent);
    } else {
      res.status(409).json({ message: "Student already Exist" });
      console.log("conflict");
    }
  } catch (err) {
    console.log(err);
  }
};
const searchStudent = (req, res) => {
  const parameter = req.params.parameter;
  res.send(console.log(parameter));
};

module.exports = { homePage, addStudent, searchStudent };
