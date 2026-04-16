const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An unexpected error occurred.',
  });
};

module.exports = { errorHandler };
