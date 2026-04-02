const Project = require('../models/Project');
const Design  = require('../models/Design');

/**
 * Ownership check helper.
 * Finds the project by id, verifies the userId matches, and returns the document.
 * If not found or not owned, it sends the response and returns null.
 */
const owned = async (id, userId, res) => {
  const project = await Project.findById(id);
  if (!project) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    return null;
  }
  if (String(project.userId) !== String(userId)) {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } });
    return null;
  }
  return project;
};

// POST /api/v1/projects
exports.create = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'Title is required' } });
    const project = await Project.create({ userId: req.user._id, title, description });
    res.status(201).json({ success: true, data: { project } });
  } catch (err) { next(err); }
};

// GET /api/v1/projects
exports.list = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: { projects } });
  } catch (err) { next(err); }
};

// GET /api/v1/projects/:id
exports.getOne = async (req, res, next) => {
  try {
    const project = await owned(req.params.id, req.user._id, res);
    if (!project) return;
    const latestDesign = project.latestDesignId
      ? await Design.findById(project.latestDesignId)
      : null;
    res.json({ success: true, data: { project, latestDesign } });
  } catch (err) { next(err); }
};

// PATCH /api/v1/projects/:id
exports.update = async (req, res, next) => {
  try {
    const project = await owned(req.params.id, req.user._id, res);
    if (!project) return;
    const { title, description, status } = req.body;
    if (title                !== undefined) project.title       = title;
    if (description          !== undefined) project.description = description;
    if (status               !== undefined) project.status      = status;
    await project.save();
    res.json({ success: true, data: { project } });
  } catch (err) { next(err); }
};

// DELETE /api/v1/projects/:id
exports.remove = async (req, res, next) => {
  try {
    const project = await owned(req.params.id, req.user._id, res);
    if (!project) return;
    // Cascade delete all designs belonging to this project
    await Design.deleteMany({ projectId: project._id });
    await project.deleteOne();
    res.json({ success: true, data: { message: 'Project deleted' } });
  } catch (err) { next(err); }
};

// GET /api/v1/projects/:id/versions
exports.getVersions = async (req, res, next) => {
  try {
    const project = await owned(req.params.id, req.user._id, res);
    if (!project) return;
    const versions = await Design.find({ projectId: project._id })
      .select('version createdAt')
      .sort({ version: -1 });
    res.json({ success: true, data: { versions } });
  } catch (err) { next(err); }
};

// GET /api/v1/projects/:id/versions/:ver
exports.getVersion = async (req, res, next) => {
  try {
    const project = await owned(req.params.id, req.user._id, res);
    if (!project) return;
    const design = await Design.findOne({ projectId: project._id, version: req.params.ver });
    if (!design)
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Version not found' } });
    res.json({ success: true, data: { design } });
  } catch (err) { next(err); }
};
