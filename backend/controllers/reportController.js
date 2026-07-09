const WeeklyReport = require('../models/WeeklyReport');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Create a new report (draft or submitted)
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    const { title, week, dateRange, project, tasksCompleted, tasksPlanned, blockers, hoursWorked, notes, status } = req.body;

    const reportStatus = status === 'Submitted' ? 'Submitted' : 'Draft';

    const report = await WeeklyReport.create({
      title,
      week,
      dateRange,
      project: project || null,
      tasksCompleted,
      tasksPlanned,
      blockers,
      hoursWorked,
      notes,
      status: reportStatus,
      submittedAt: reportStatus === 'Submitted' ? new Date() : null,
      createdBy: req.user._id,
    });

    await report.populate('project', 'name');
    await report.populate('createdBy', 'name email avatar');
    sendSuccess(res, 201, report, `Report ${reportStatus === 'Submitted' ? 'submitted' : 'saved as draft'}.`);
  } catch (err) {
    next(err);
  }
};

// @desc    Get own reports (member) OR all reports (manager)
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res, next) => {
  try {
    const { status, project, week, memberId, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = {};

    // Members only see their own reports
    if (req.user.role === 'member') {
      query.createdBy = req.user._id;
    } else if (memberId) {
      query.createdBy = memberId;
    }

    if (status) query.status = status;
    if (project) query.project = project;
    if (week) query.week = week;
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [total, reports] = await Promise.all([
      WeeklyReport.countDocuments(query),
      WeeklyReport.find(query)
        .populate('project', 'name status')
        .populate('createdBy', 'name email avatar department')
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
    ]);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res, next) => {
  try {
    const report = await WeeklyReport.findById(req.params.id)
      .populate('project', 'name status')
      .populate('createdBy', 'name email avatar department')
      .populate('approvedBy', 'name');

    if (!report) return sendError(res, 404, 'Report not found.');

    // Members can only view their own
    if (req.user.role === 'member' && String(report.createdBy._id) !== String(req.user._id)) {
      return sendError(res, 403, 'Not authorized to view this report.');
    }

    sendSuccess(res, 200, report);
  } catch (err) {
    next(err);
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private (owner) or Manager
exports.updateReport = async (req, res, next) => {
  try {
    const report = await WeeklyReport.findById(req.params.id);
    if (!report) return sendError(res, 404, 'Report not found.');

    // Members can only edit their own reports
    if (req.user.role === 'member' && String(report.createdBy) !== String(req.user._id)) {
      return sendError(res, 403, 'Not authorized.');
    }

    const updates = { ...req.body };

    // Handle status change to Submitted
    if (updates.status === 'Submitted' && report.status !== 'Submitted') {
      updates.submittedAt = new Date();
    }



    const updated = await WeeklyReport.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('project', 'name status')
      .populate('createdBy', 'name email avatar');

    sendSuccess(res, 200, updated, 'Report updated.');
  } catch (err) {
    next(err);
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (owner draft) or Manager
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await WeeklyReport.findById(req.params.id);
    if (!report) return sendError(res, 404, 'Report not found.');

    if (req.user.role === 'member') {
      if (String(report.createdBy) !== String(req.user._id)) return sendError(res, 403, 'Not authorized.');
      if (report.status !== 'Draft') return sendError(res, 400, 'Can only delete draft reports.');
    }

    await report.deleteOne();
    sendSuccess(res, 200, null, 'Report deleted.');
  } catch (err) {
    next(err);
  }
};

// @desc    Get reports for current week (team view for manager)
// @route   GET /api/reports/team-week
// @access  Manager
exports.getTeamWeekReports = async (req, res, next) => {
  try {
    const { week } = req.query;
    const query = week ? { week } : {};

    const reports = await WeeklyReport.find(query)
      .populate('project', 'name')
      .populate('createdBy', 'name email avatar department')
      .sort({ updatedAt: -1 });

    sendSuccess(res, 200, reports);
  } catch (err) {
    next(err);
  }
};
