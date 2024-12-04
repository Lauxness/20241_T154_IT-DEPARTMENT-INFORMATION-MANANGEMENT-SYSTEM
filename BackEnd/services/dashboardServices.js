const Accounts = require("../models/accountsModel");
const Student = require("../models/studentModel");
const Requirement = require("../models/requirementsModel");
const getDashboard = async (req, res) => {
  try {
    const students = await Student.find();
    const accounts = await Accounts.find({ role: "officer" });
    const requirement = await Requirement.find();

    if (students && accounts && requirement) {
      data = { students, accounts, requirement };
      return res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No data found!" });
    }
  } catch (error) {
    return res.status(501).json({ message: "Internal Server Error!" });
  }
};
const getEnrollmentOfficer = async (req, res) => {
  try {
    const officers = await Accounts.find({ role: "officer" });
    res.status(200).json(officers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateReport = (req, res) => {
  res.send(console.log("Generate Report"));
};

module.exports = { getDashboard, getEnrollmentOfficer, generateReport };
