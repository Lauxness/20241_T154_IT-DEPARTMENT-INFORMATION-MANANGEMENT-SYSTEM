const express = require("express");
const requirementsRoute = require("./requirements");
const router = express.Router();
const {
  unlock,
  restoreStudent,
  getAllStudents,
  selectStudent,
  updateStudent,
  archiveStudent,
} = require("../services/studentServices");

router.get("/", getAllStudents);
router.get("/:id", selectStudent);
router.patch("/:id", updateStudent);
router.patch("/archive/:id", archiveStudent);
router.patch("/restore/:id", restoreStudent);
router.patch("/unlock/:id", unlock);

router.use("/requirements", requirementsRoute);

module.exports = router;
