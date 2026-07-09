const express = require('express');
const router = express.Router();
const { processQuery } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

router.post('/query', protect, authorize('manager'), processQuery);

module.exports = router;
