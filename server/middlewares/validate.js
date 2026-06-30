/**
 * Zod validation middleware factory
 * Takes a Zod schema and returns Express middleware that validates req.body
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  // Replace body with validated and transformed data
  req.body = result.data;
  next();
};

module.exports = validate;
