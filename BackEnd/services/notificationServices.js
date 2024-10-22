const notifyStudent = (req, res) => {
  res.send(console.log("student notified"));
};
const viewInboxes = (req, res) => {
  res.send(console.log("Inbox viewed"));
};
const selectInbox = (req, res) => {
  const id = req.params.id;
  res.send(console.log(`Viewed selected Inbox of ${id}`));
};
const deleteInbox = (req, res) => {
  const id = req.params.id;
  res.send(console.log(`Inbox Deleted ${id}`));
};

module.exports = { notifyStudent, viewInboxes, selectInbox, deleteInbox };
