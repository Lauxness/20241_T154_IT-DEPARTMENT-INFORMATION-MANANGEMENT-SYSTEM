const express = require("express");
const { getAllActivities } = require("../services/activitiesServices");
const router = express.Router();

router.get("/logs", (req, res) => {
  getAllActivities(req, res);
});

module.exports = router;
