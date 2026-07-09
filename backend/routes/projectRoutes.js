const express = require('express');
const router = express.Router();
const {
  createProject, getProjects, getProject, updateProject, deleteProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('manager'), createProject);

router.route('/:id')
  .get(getProject)
  .put(authorize('manager'), updateProject)
  .delete(authorize('manager'), deleteProject);

module.exports = router;
