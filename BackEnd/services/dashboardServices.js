const getDashboard = (req, res) => {
  res.send(console.log("In the dashboard"));
};
const getEnrollmentOfficer = (req, res) => {
  res.send(console.log("List of enrollment Officer"));
};
const generateReport = (req, res) => {
  res.send(console.log("Generate Report"));
};

module.exports = { getDashboard, getEnrollmentOfficer, generateReport };
