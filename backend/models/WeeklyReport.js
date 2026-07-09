const mongoose = require('mongoose');

const WeeklyReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    week: {
      type: String, // e.g. "2024-W42"
      required: [true, 'Week is required'],
      trim: true,
    },
    dateRange: {
      start: { type: Date },
      end: { type: Date },
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    tasksCompleted: {
      type: String,
      default: '',
      maxlength: [2000],
    },
    tasksPlanned: {
      type: String,
      default: '',
      maxlength: [2000],
    },
    blockers: {
      type: String,
      default: '',
      maxlength: [2000],
    },
    hoursWorked: {
      type: Number,
      default: 0,
      min: 0,
      max: 168,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000],
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Approved', 'Action Required'],
      default: 'Draft',
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    managerComment: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
WeeklyReportSchema.index({ createdBy: 1, week: -1 });
WeeklyReportSchema.index({ project: 1 });
WeeklyReportSchema.index({ status: 1 });
WeeklyReportSchema.index({ week: -1 });

module.exports = mongoose.model('WeeklyReport', WeeklyReportSchema);
