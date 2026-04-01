const router = require('express').Router();
const { body } = require('express-validator');
const ctrl    = require('../controllers/auth.controller');

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], ctrl.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], ctrl.login);

router.post('/refresh', ctrl.refresh);
router.post('/logout',  ctrl.logout);

module.exports = router;
