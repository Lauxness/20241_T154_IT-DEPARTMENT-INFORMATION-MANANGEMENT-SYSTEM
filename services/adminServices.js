const addEnrollmentOfficer = (req, res) => {
  const enrollmentOfficer = req.body;
  res.send(console.log("Added a enrollment Officer"));
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
