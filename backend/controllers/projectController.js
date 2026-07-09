const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Create project
// @route   POST /api/projects
// @access  Manager
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, status, dueDate, members } = req.body;
    const project = await Project.create({
      name,
      description,
      status: status || 'Planning',
      dueDate: dueDate || null,
      members: members || [],
      createdBy: req.user._id,
    });

    await project.populate('createdBy', 'name email');
    await project.populate('members', 'name email avatar');
    sendSuccess(res, 201, project, 'Project created.');
  } catch (err) {
    next(err);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    // Members only see projects they're part of
    if (req.user.role === 'member') {
      query.members = req.user._id;
    }

    if (status && status !== 'All Projects') query.status = status;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, projects);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email avatar department');

    if (!project) return sendError(res, 404, 'Project not found.');
    sendSuccess(res, 200, project);
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Manager
exports.updateProject = async (req, res, next) => {
  try {
    const { name, description, status, dueDate, members } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status, dueDate, members },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('members', 'name email avatar');

    if (!project) return sendError(res, 404, 'Project not found.');
    sendSuccess(res, 200, project, 'Project updated.');
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Manager
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return sendError(res, 404, 'Project not found.');
    sendSuccess(res, 200, null, 'Project deleted.');
  } catch (err) {
    next(err);
  }
};
