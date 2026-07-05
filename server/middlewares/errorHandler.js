const ApiError = require("../utils/ApiError");

/**
 * Centralized error handling middleware
 * Handles known ApiError instances and unexpected errors
 */
const errorHandler = (err, req, res, _next) => {
  // Handle known API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
  }

  // Unhandled errors
  console.error("Unhandled Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
