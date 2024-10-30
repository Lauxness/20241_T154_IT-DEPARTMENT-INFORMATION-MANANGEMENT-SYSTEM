const Accounts = require("../models/accountsModel");

const addEnrollmentOfficer = async (req, res) => {
  const {
    googleId,
    givenName,
    surName,
    emailAddress,
    profilePicture,
    accessToken,
    refreshToken,
    role,
    assignedYear,
  } = req.body;
  console.log(
    googleId,
    givenName,
    surName,
    emailAddress,
    profilePicture,
    accessToken,
    refreshToken,
    role,
    assignedYear
  );
  try {
    const newAccount = await Accounts.create({
      googleId,
      givenName,
      surName,
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

const deleteEnrollmentOfficer = (req, res) => {
  const id = req.params.id;
  res.send(console.log(id));
};
const updateEnrollmentOfficer = (req, res) => {
  const id = req.params.id;
  res.send(console.log(id));
};

module.exports = {
  addEnrollmentOfficer,
  deleteEnrollmentOfficer,
  updateEnrollmentOfficer,
};
