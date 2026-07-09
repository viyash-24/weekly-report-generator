const express = require('express');
const router = express.Router();
const {
  getManagerDashboard,
  getMemberDashboard,
  getSubmissionChart,
  getProjectWorkload,
  getTeamProductivity,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/manager', authorize('manager'), getManagerDashboard);
router.get('/member', getMemberDashboard);
router.get('/analytics/submissions', authorize('manager'), getSubmissionChart);
router.get('/analytics/projects', authorize('manager'), getProjectWorkload);
router.get('/analytics/productivity', authorize('manager'), getTeamProductivity);

module.exports = router;
