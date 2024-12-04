const activityLog = require("../models/activitiesModel");

const getAllActivities = async (req, res) => {
  const role = req.user.role;
  try {
    if (role === "admin") {
      const activityLogs = await activityLog
        .find()
        .populate("student", "studentName studentId")
        .populate("officer", "name")
        .sort({ createdAt: -1 })
        .exec();

      return res.status(200).json(activityLogs);
    } else if (role === "officer") {
      const officerId = req.user.id;
      const activityLogs = await activityLog
        .find({ officer: officerId })
        .populate("student", "studentName studentId")
        .populate("officer", "name")
        .sort({ createdAt: -1 })
        .exec();

      if (!activityLogs || activityLogs.length === 0) {
        return res
          .status(204)
          .json({ message: "No activity logs found for this officer" });
      }
      return res.status(200).json(activityLogs);
    }
  } catch (err) {
    console.error("Error fetching officer activity logs:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAllActivities };
