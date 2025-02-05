const Student = require("../models/studentModel");

const unlockStudent = async (id) => {
  const student = await Student.findOneAndUpdate(
    { _id: id },
    { isLocked: false },
    { new: true }
  );
  if (!student) {
    return false;
  } else {
    console.log(student);
    return true;
  }
};

module.exports = { unlockStudent };
