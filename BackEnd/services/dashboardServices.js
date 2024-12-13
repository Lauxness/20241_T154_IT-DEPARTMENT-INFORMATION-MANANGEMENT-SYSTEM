const Accounts = require("../models/accountsModel");
const Student = require("../models/studentModel");
const Requirement = require("../models/requirementsModel");
const Semester = require("../models/schoolYearModel");
const ReportPDF = require("../utils/pdf");
const getDashboard = async (req, res) => {
  try {
    const semester = await Semester.find()
      .sort({ createdAt: -1 })
      .populate("students");
    const students = semester[0].students;
    const accounts = await Accounts.find({ role: "officer" });
    const requirement = await Requirement.find();

    if (students && accounts && requirement) {
      data = { students, accounts, requirement };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "No data found!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};
const getEnrollmentOfficer = async (req, res) => {
  const role = req.user.role;
  if (role === "officer") {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  try {
    const officers = await Accounts.find({ role: "officer", isActive: true });
    console.log(officers);
    res.status(200).json(officers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const generateReport = async (req, res) => {
  const officerName = req.user.name;
  try {
    const date = new Date().toLocaleDateString();
    const semester = await Semester.find()
      .sort({ createdAt: -1 })
      .populate("students");
    console.log(semester);
    const currentSemester =
      "S.Y " +
      semester[0].schoolYear +
      " " +
      semester[0].semester +
      " Semester";
    const requirements = await Requirement.find();
    const students = semester[0].students;
    const totalStudents = students.length;
    const totalComplete = students.filter(
      (student) => student.isComplete === true
    ).length;
    const totalIncomplete = students.filter(
      (student) => student.isComplete === false
    ).length;
    const totalRequirements = requirements.length;
    const totalFirstYear = students.filter(
      (student) => student.year === "1st Year"
    ).length;
    const totalSecondYear = students.filter(
      (student) => student.year === "2nd Year"
    ).length;
    const totalThirdYear = students.filter(
      (student) => student.year === "3rd Year"
    ).length;
    const totalFourthYear = students.filter(
      (student) => student.year === "4th Year"
    ).length;
    const regularStudents = students.filter(
      (student) => student.status === "Regular"
    ).length;
    const irregularStudents = students.filter(
      (student) => student.status === "Irregular"
    ).length;
    const LOA = students.filter((student) => student.status === "LOA").length;
    const totalBSITStudents = students.filter(
      (student) => student.program === "BSIT"
    ).length;
    const totalBSEMCStudents = students.filter(
      (student) => student.program === "BSEMC"
    ).length;
    const totalArchiveStudents = students.filter(
      (student) => student.isArchived === true
    ).length;
    const pdf = new ReportPDF();
    pdf.addHeader(
      date,
      currentSemester,
      totalStudents,
      totalComplete,
      totalIncomplete,
      totalRequirements,
      totalFirstYear,
      totalSecondYear,
      totalThirdYear,
      totalFourthYear,
      regularStudents,
      irregularStudents,
      LOA,
      totalBSITStudents,
      totalBSEMCStudents,
      totalArchiveStudents
    );
    pdf.footer(officerName);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=student_information_report_summary.pdf"
    );
    pdf.doc.pipe(res);
    pdf.doc.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = { getDashboard, getEnrollmentOfficer, generateReport };
