const VisitorLog = require("../models/VisitorLog");
const User = require("../models/User");

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const totalVisitors = await VisitorLog.countDocuments();

    // Average session duration (only completed sessions)
    const avgResult = await VisitorLog.aggregate([
      { $match: { durationSeconds: { $ne: null } } },
      { $group: { _id: null, avg: { $avg: "$durationSeconds" } } },
    ]);
    const avgDurationSeconds = avgResult[0]?.avg ?? 0;

    // Visits per day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const visitsPerDay = await VisitorLog.aggregate([
      { $match: { sessionStart: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$sessionStart" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalUsers = await User.countDocuments({ role: "student" });

    res.json({
      totalVisitors,
      avgDurationSeconds: Math.round(avgDurationSeconds),
      avgDurationFormatted: formatDuration(Math.round(avgDurationSeconds)),
      visitsPerDay,
      totalUsers,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/visit/start
const startVisit = async (req, res, next) => {
  try {
    const log = await VisitorLog.create({
      userId: req.body.userId || null,
      sessionStart: new Date(),
    });
    res.json({ visitId: log._id });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/visit/end
const endVisit = async (req, res, next) => {
  try {
    const { visitId } = req.body;
    const log = await VisitorLog.findById(visitId);
    if (!log) return res.status(404).json({ message: "Visit not found." });

    const sessionEnd = new Date();
    const durationSeconds = Math.round((sessionEnd - log.sessionStart) / 1000);

    await VisitorLog.findByIdAndUpdate(visitId, { sessionEnd, durationSeconds });
    res.json({ message: "Visit ended.", durationSeconds });
  } catch (err) {
    next(err);
  }
};

const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

module.exports = { getStats, startVisit, endVisit };