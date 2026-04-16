const { z } = require('zod');

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: result.error.errors[0].message,
      details: result.error.errors,
    });
  }
  req[source] = result.data;
  next();
};

module.exports = { validate };
