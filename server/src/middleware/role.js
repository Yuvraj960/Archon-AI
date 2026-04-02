/**
 * Role-based access guard.
 * Usage:  router.delete('/admin', auth, role('admin'), ctrl.adminAction)
 *
 * @param {...string} roles — one or more permitted roles
 */
module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({
      success: false,
      error:   { code: 'FORBIDDEN', message: 'Access denied' },
    });
  next();
};
