const getAllStudents = (req, res) => {
  res.send(console.log("get all student"));
};
const selectStudent = (req, res) => {
  const id = req.params.id;
  res.send(console.log(id));
};
const updateStudent = (req, res) => {
  const id = req.params.id;
  res.send(console.log(id));
};
const archiveStudent = (req, res) => {
  const id = req.params.id;
  res.send(console.log(id));
};

module.exports = {
  getAllStudents,
  selectStudent,
  updateStudent,
  archiveStudent,
};
