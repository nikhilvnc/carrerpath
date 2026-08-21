/**
 * Zod Input Validation Middleware
 */

const ApiResponse = require('../utils/responseFormatter');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed; // Replace with sanitized & typed data
      next();
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return ApiResponse.error(res, 'Validation failed. Please check your inputs.', 400, formattedErrors);
      }
      return ApiResponse.error(res, 'Invalid request payload format.', 400);
    }
  };
};

module.exports = {
  validate
};
