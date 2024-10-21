const landingPage = (req, res) => {
  res.send(console.log("Landing page"));
};
const login = (req, res) => {
  res.send(console.log("logged in"));
};

module.exports = { landingPage, login };
