/**
 * Global error handler — must be registered LAST with app.use().
 * Catches anything forwarded via next(err).
 */

// For Local Development (detailed errors)
// module.exports = (err, req, res, next) => {
//   console.error(err.stack);
//   const status = err.statusCode || 500;
//   res.status(status).json({
//     success: false,
//     error:   { code: err.code || 'SERVER_ERROR', message: err.message || 'Internal server error' },
//   });
// };


// For Production (generic messages)
module.exports = (err, req, res, next) => {
  // Structured log (Render captures stdout as logs)
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    code: err.code || 'SERVER_ERROR',
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  }));

  const message = process.env.NODE_ENV === 'production' && !err.statusCode
    ? 'Internal server error'
    : err.message;

  res.status(err.statusCode || 500).json({
    success: false,
    error: { code: err.code || 'SERVER_ERROR', message }
  });
};