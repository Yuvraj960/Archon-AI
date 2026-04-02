const router     = require('express').Router();
const auth       = require('../middleware/auth');
const ctrl       = require('../controllers/project.controller');
const exportCtrl = require('../controllers/export.controller');

// All project routes require a valid JWT
router.use(auth);

router.post('/',                  ctrl.create);
router.get('/',                   ctrl.list);

// Export must come BEFORE /:id to avoid "export" being matched as an :id segment
router.get('/:id/export',         exportCtrl.exportDesign);

router.get('/:id',                ctrl.getOne);
router.patch('/:id',              ctrl.update);
router.delete('/:id',             ctrl.remove);
router.get('/:id/versions',       ctrl.getVersions);
router.get('/:id/versions/:ver',  ctrl.getVersion);

module.exports = router;
