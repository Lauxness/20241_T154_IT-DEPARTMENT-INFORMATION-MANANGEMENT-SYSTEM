const Accounts = require("../models/accountsModel");

const addEnrollmentOfficer = async (req, res) => {
  const {
    googleId,
    name,
    emailAddress,
    profilePicture,
    accessToken,
    refreshToken,
    role,
    assignedYear,
  } = req.body;

  try {
    const newAccount = await Accounts.create({
      googleId,
      name,
      emailAddress,
      profilePicture,
      accessToken,
      refreshToken,
      role,
      assignedYear,
    });
    res.status(200).json(newAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const searchEnrollmentOfficer = async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      // Get a specific Enrollment Officer by ID
      const officer = await Accounts.findById(id);
      if (!officer) {
        return res.status(404).json({ error: "Enrollment Officer not found" });
      }
      return res.status(200).json(officer);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteEnrollmentOfficer = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedAccount = await Accounts.findByIdAndDelete(id);
    if (!deletedAccount) {
      return res.status(404).json({ error: "Enrollment Officer not found" });
    }
    res
      .status(200)
      .json({ message: "Enrollment Officer deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateEnrollmentOfficer = async (req, res) => {
  const updatedOfficer = req.body;
  console.log("REquest body", updatedOfficer.emailAddress);
  try {
    const enrollmentOfficer = await Accounts.findById(req.params.id);
    if (!enrollmentOfficer) {
      return res.status(404).json({ message: "Student not found" });
    }
    enrollmentOfficer.googleId =
      req.body.googleId || enrollmentOfficer.googleId;
    enrollmentOfficer.name = req.body.name || enrollmentOfficer.name;
    enrollmentOfficer.emailAddress = req.body.emailAddress;
    enrollmentOfficer.accessToken =
      req.body.accessToken || enrollmentOfficer.accessToken;
    enrollmentOfficer.refreshToken =
      req.body.refreshToken || enrollmentOfficer.refreshToken;
    enrollmentOfficer.role = req.body.role || enrollmentOfficer.role;
    enrollmentOfficer.assignedYear =
      req.body.assignedYear || enrollmentOfficer.assignedYear;

    const updatedEnrollmentOfficer = await enrollmentOfficer.save();
    res.status(200).json(updatedEnrollmentOfficer);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addEnrollmentOfficer,
  deleteEnrollmentOfficer,
  updateEnrollmentOfficer,
  searchEnrollmentOfficer,
};
