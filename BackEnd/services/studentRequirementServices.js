const viewRequirements = (req, res, student) => {
  res.send(console.log(id));
};
const uploadImage = (req, res) => {
  res.send(console.log("Uploaded Image"));
};
const updateRequirement = (req, res) => {
  const id = req.params.id;
  res.send(console.log(id));
};
const viewRequirementImage = (req, res) => {
  const name = req.params.name;
  res.send(console.log(name));
};
const deleteRequirementImage = (req, res) => {
  const name = req.params.name;
  res.send(console.log(name));
};

module.exports = {
  viewRequirements,
  uploadImage,
  updateRequirement,
  viewRequirementImage,
  deleteRequirementImage,
};
