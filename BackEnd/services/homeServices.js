const homePage = (req, res) => {
  res.send(console.log("home"));
};
const addStudent = (req, res) => {
  res.send(console.log("add new student"));
};
const searchStudent = (req, res) => {
  const parameter = req.params.parameter;
  res.send(console.log(parameter));
};

module.exports = { homePage, addStudent, searchStudent };
