const activityLog = require("../models/activitiesModel");

const getAllActivities = async (req, res) => {
  const role = req.user.role;
  try {
    let activityLogs;

    if (role === "admin") {
      activityLogs = await activityLog
        .find()
        .populate("student", "studentName studentId")
        .populate("officer", "name")
        .sort({ createdAt: -1 })
        .exec();
    } else if (role === "officer") {
      const officerId = req.user.id;
      activityLogs = await activityLog
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
    }
    const groupedLogs = activityLogs.reduce((group, log) => {
      const date = log.createdAt.toISOString().split("T")[0];
      if (!group[date]) {
        group[date] = [];
      }
      group[date].push(log);
      return group;
    }, {});

    return res.status(200).json(groupedLogs);
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAllActivities };
