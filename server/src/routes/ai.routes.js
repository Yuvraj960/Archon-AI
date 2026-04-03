const router = require('express').Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/ai.controller');

// All AI routes require a valid JWT
router.use(auth);

router.post('/questions',        ctrl.generateQuestions);  // Step 1 — wizard questions
router.post('/refine',           ctrl.refineInput);        // Step 2 — structured JSON
router.post('/generate-design',  ctrl.generateDesign);     // Step 3 — full design
router.post('/update-design',    ctrl.updateDesign);       // Chat refinement
router.post('/generate-diagram', ctrl.generateDiagram);    // Mermaid diagram

module.exports = router;
