const aiService = require('../services/ai.service');
const Project   = require('../models/Project');
const Design    = require('../models/Design');
const Prompt    = require('../models/Prompt');

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Verify the project exists and belongs to the requesting user.
 * Writes the error response and returns null if the check fails.
 */
const getOwnedProject = async (projectId, userId, res) => {
  const project = await Project.findById(projectId);
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

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/v1/ai/questions
 * Step 1 — Generate 6 clarifying wizard questions (with suggestion chips) from a raw idea.
 * Body: { projectId, rawInput }
 */
exports.generateQuestions = async (req, res, next) => {
  try {
    const { projectId, rawIdea } = req.body;
    if (!rawIdea)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'rawIdea is required' } });

    // Since we don't have a projectId at Step 1, we skip the ownership check if missing
    if (projectId) {
      const project = await getOwnedProject(projectId, req.user._id, res);
      if (!project) return;
    }

    const { questions, tokensUsed } = await aiService.generateQuestions(rawIdea);

    // Persist prompt log (projectId is now optional in model)
    await Prompt.create({
      projectId: projectId || null,
      rawInput: rawIdea,
      aiResponse: JSON.stringify(questions),
      tokensUsed,
      type: 'questions',
    });

    res.json({ success: true, data: { questions } });
  } catch (err) { next(err); }
};

/**
 * POST /api/v1/ai/refine
 * Step 2 — Convert raw idea + wizard answers into a structured JSON spec.
 * Body: { projectId, rawInput, answers }
 */
exports.refineInput = async (req, res, next) => {
  try {
    const { projectId, rawIdea, answers } = req.body;
    if (!projectId || !rawIdea || !answers)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'projectId, rawIdea and answers are required' } });

    const project = await getOwnedProject(projectId, req.user._id, res);
    if (!project) return;

    const { refinedInput, tokensUsed } = await aiService.refineInput(rawIdea, answers);

    await Prompt.create({
      projectId,
      rawInput: rawIdea,
      refinedInput,
      aiResponse: JSON.stringify(refinedInput),
      tokensUsed,
      type: 'refine',
    });

    res.json({ success: true, data: { refinedInput } });
  } catch (err) { next(err); }
};

/**
 * POST /api/v1/ai/generate-design
 * Step 3 — Generate the full architecture design and save a new Design version to MongoDB.
 * Body: { projectId, refinedInput }
 */
exports.generateDesign = async (req, res, next) => {
  try {
    const { projectId, structuredInput } = req.body;
    if (!projectId || !structuredInput)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'projectId and structuredInput are required' } });

    const project = await getOwnedProject(projectId, req.user._id, res);
    if (!project) return;

    const { designData, tokensUsed } = await aiService.generateDesign(structuredInput);

    // Auto-increment version
    const latestDesign = await Design.findOne({ projectId }).sort({ version: -1 });
    const version = latestDesign ? latestDesign.version + 1 : 1;

    const design = await Design.create({ projectId, version, ...designData });

    // Keep project pointer updated
    project.latestDesignId = design._id;
    await project.save();

    await Prompt.create({
      projectId,
      designId: design._id,
      rawInput: JSON.stringify(structuredInput),
      aiResponse: JSON.stringify(designData),
      tokensUsed,
      type: 'generate',
    });

    res.status(201).json({ success: true, data: { design } });
  } catch (err) { next(err); }
};

/**
 * POST /api/v1/ai/update-design
 * Chat refinement — update the current design based on freeform user feedback.
 * Creates a new versioned Design document rather than mutating the old one.
 * Body: { projectId, designId, feedback }
 */
exports.updateDesign = async (req, res, next) => {
  try {
    const { projectId, designId, instruction } = req.body;
    if (!projectId || !designId || !instruction)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'projectId, designId and instruction are required' } });

    const project = await getOwnedProject(projectId, req.user._id, res);
    if (!project) return;

    const existingDesign = await Design.findById(designId);
    if (!existingDesign)
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Design not found' } });

    const { designData, tokensUsed } = await aiService.updateDesign(existingDesign, instruction);

    // Extract changesSummary before spreading into DB create
    const { changesSummary, ...designFields } = designData;

    const newDesign = await Design.create({
      projectId,
      version: existingDesign.version + 1,
      diagram: existingDesign.diagram, // Preserve existing diagram until regenerated
      ...designFields,
    });

    project.latestDesignId = newDesign._id;
    await project.save();

    // Auto-regenerate diagram for the updated architecture
    try {
      const { diagram } = await aiService.generateDiagram(newDesign);
      newDesign.diagram = diagram;
      await newDesign.save();
    } catch (diagramErr) {
      // Non-fatal — we still return the updated design even if diagram fails
      console.warn('[AI] Diagram regeneration failed after update:', diagramErr.message);
    }

    await Prompt.create({
      projectId,
      designId: newDesign._id,
      rawInput: instruction,
      aiResponse: JSON.stringify(designData),
      tokensUsed,
      type: 'update',
    });

    res.json({
      success: true,
      data: {
        design:  await Design.findById(newDesign._id),
        message: changesSummary || 'Design updated successfully.',
      },
    });
  } catch (err) { next(err); }
};

/**
 * POST /api/v1/ai/generate-diagram
 * Generate (or regenerate) a Mermaid.js diagram string for a given design.
 * Body: { projectId, designId }
 */
exports.generateDiagram = async (req, res, next) => {
  try {
    const { projectId, designId } = req.body;
    if (!projectId || !designId)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'projectId and designId are required' } });

    const project = await getOwnedProject(projectId, req.user._id, res);
    if (!project) return;

    const design = await Design.findById(designId);
    if (!design)
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Design not found' } });

    const { diagram, tokensUsed } = await aiService.generateDiagram(design);

    design.diagram = diagram;
    await design.save();

    await Prompt.create({
      projectId,
      designId: design._id,
      rawInput: 'generate-diagram',
      aiResponse: diagram,
      tokensUsed,
      type: 'generate',
    });

    res.json({ success: true, data: { diagram } });
  } catch (err) { next(err); }
};
