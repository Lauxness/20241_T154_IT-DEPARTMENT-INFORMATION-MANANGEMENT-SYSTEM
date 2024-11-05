const homePage = (req, res) => {
  res.send(console.log("home"));
  const refresh_token = req.session.tokens.refresh_token;
  console.log("current refresh token: ", refresh_token);
};
const addStudent = (req, res) => {
  res.send(console.log("add new student"));
};
const searchStudent = (req, res) => {
  const parameter = req.params.parameter;
  res.send(console.log(parameter));
};

module.exports = { homePage, addStudent, searchStudent };
