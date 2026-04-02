/**
 * Global error handler — must be registered LAST with app.use().
 * Catches anything forwarded via next(err).
 */
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error:   { code: err.code || 'SERVER_ERROR', message: err.message || 'Internal server error' },
  });
};
