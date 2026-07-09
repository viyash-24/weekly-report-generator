const WeeklyReport = require('../models/WeeklyReport');
const User = require('../models/User');
const Project = require('../models/Project');
const { sendSuccess } = require('../utils/apiResponse');

// Helper: get current ISO week string e.g. "2024-W42"
const getCurrentWeek = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

// @desc    Manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Manager
exports.getManagerDashboard = async (req, res, next) => {
  try {
    const currentWeek = getCurrentWeek();

    const [
      totalReports,
      approvedReports,
      pendingReports,
      draftReports,
      totalUsers,
      activeManagers,
      recentReports,
    ] = await Promise.all([
      WeeklyReport.countDocuments(),
      WeeklyReport.countDocuments({ status: 'Approved' }),
      WeeklyReport.countDocuments({ status: 'Submitted' }),
      WeeklyReport.countDocuments({ status: 'Draft' }),
      User.countDocuments(),
      User.countDocuments({ role: 'manager', status: 'active' }),
      WeeklyReport.find({}, 'title status createdBy project updatedAt')
        .populate('createdBy', 'name email avatar')
        .populate('project', 'name')
        .sort({ updatedAt: -1 })
        .limit(10),
    ]);

    // Activity feed derived from recent reports
    const activityFeed = recentReports.map((r) => ({
      id: r._id,
      user: r.createdBy?.name || 'Unknown',
      avatar: r.createdBy?.avatar || '',
      action:
        r.status === 'Submitted'
          ? 'submitted'
          : r.status === 'Approved'
          ? 'approved'
          : 'updated',
      target: r.title,
      time: r.updatedAt,
    }));

    sendSuccess(res, 200, {
      stats: {
        totalReports,
        approved: approvedReports,
        pending: pendingReports,
        drafts: draftReports,
        totalUsers,
        activeManagers,
      },
      activityFeed,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Member dashboard stats
// @route   GET /api/dashboard/member
// @access  Private
exports.getMemberDashboard = async (req, res, next) => {
  try {
    const currentWeek = getCurrentWeek();
    const userId = req.user._id;

    const [statsResult, recentReports, currentWeekReport] = await Promise.all([
      WeeklyReport.aggregate([
        { $match: { createdBy: userId } },
        {
          $group: {
            _id: null,
            totalReports: { $sum: 1 },
            submitted: { $sum: { $cond: [{ $eq: ['$status', 'Submitted'] }, 1, 0] } },
            drafts: { $sum: { $cond: [{ $eq: ['$status', 'Draft'] }, 1, 0] } }
          }
        }
      ]),
      WeeklyReport.find({ createdBy: userId }, 'title status week project createdAt')
        .populate('project', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      WeeklyReport.findOne({ createdBy: userId, week: currentWeek }),
    ]);

    const statsAgg = statsResult[0] || { totalReports: 0, submitted: 0, drafts: 0 };

    sendSuccess(res, 200, {
      stats: {
        totalReports: statsAgg.totalReports,
        submitted: statsAgg.submitted,
        drafts: statsAgg.drafts,
        currentWeekStatus: currentWeekReport ? currentWeekReport.status : 'Not Started',
      },
      recentReports,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Analytics: weekly submission chart data
// @route   GET /api/dashboard/analytics/submissions
// @access  Manager
exports.getSubmissionChart = async (req, res, next) => {
  try {
    // Last 6 weeks
    const weeks = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const weekNo = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
      weeks.push(`${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`);
    }

    const chartData = await Promise.all(
      weeks.map(async (week) => {
        const [submitted, pending, blocked] = await Promise.all([
          WeeklyReport.countDocuments({ week, status: { $in: ['Submitted', 'Approved'] } }),
          WeeklyReport.countDocuments({ week, status: 'Draft' }),
          WeeklyReport.countDocuments({ week, blockers: { $ne: '' } }),
        ]);
        return { week, submitted, pending, blocked };
      })
    );

    sendSuccess(res, 200, chartData);
  } catch (err) {
    next(err);
  }
};

// @desc    Analytics: workload by project
// @route   GET /api/dashboard/analytics/projects
// @access  Manager
exports.getProjectWorkload = async (req, res, next) => {
  try {
    const data = await WeeklyReport.aggregate([
      { $match: { project: { $ne: null } } },
      { $group: { _id: '$project', count: { $sum: 1 }, hours: { $sum: '$hoursWorked' } } },
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
      { $unwind: '$project' },
      { $project: { name: '$project.name', count: 1, hours: 1, status: '$project.status' } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    sendSuccess(res, 200, data);
  } catch (err) {
    next(err);
  }
};

// @desc    Analytics: team productivity
// @route   GET /api/dashboard/analytics/productivity
// @access  Manager
exports.getTeamProductivity = async (req, res, next) => {
  try {
    const data = await WeeklyReport.aggregate([
      {
        $group: {
          _id: '$createdBy',
          totalReports: { $sum: 1 },
          submitted: { $sum: { $cond: [{ $in: ['$status', ['Submitted', 'Approved']] }, 1, 0] } },
          totalHours: { $sum: '$hoursWorked' },
        },
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          avatar: '$user.avatar',
          totalReports: 1,
          submitted: 1,
          totalHours: 1,
          compliance: {
            $cond: [
              { $gt: ['$totalReports', 0] },
              { $multiply: [{ $divide: ['$submitted', '$totalReports'] }, 100] },
              0,
            ],
          },
        },
      },
      { $sort: { submitted: -1 } },
    ]);
    sendSuccess(res, 200, data);
  } catch (err) {
    next(err);
  }
};
