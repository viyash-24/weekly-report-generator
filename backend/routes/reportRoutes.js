const express = require('express');
const router = express.Router();
const {
  createReport, getReports, getReport,
  updateReport, deleteReport, getTeamWeekReports,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getReports)
  .post(createReport);

router.get('/team-week', authorize('manager'), getTeamWeekReports);

router.route('/:id')
  .get(getReport)
  .put(updateReport)
  .delete(deleteReport);

module.exports = router;
