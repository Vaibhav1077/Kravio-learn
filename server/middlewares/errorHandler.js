const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");
const crypto = require("crypto");

/**
 * Generate a short unique request ID for error tracking
 * @returns {string} A 12-character hex string
 */
const generateRequestId = () => {
  return crypto.randomBytes(6).toString("hex");
};

/**
 * Centralized error handler middleware
 * Handles ApiError instances, Zod validation errors, Mongoose errors,
 * and unexpected errors with proper logging and request ID tracking.
 */
const errorHandler = (err, req, res, _next) => {
  const requestId = req.headers["x-request-id"] || generateRequestId();

  // Known API errors
  if (err instanceof ApiError) {
    logger.warn(`API Error: ${err.message}`, {
      requestId,
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      requestId,
      ...(err.errors.length > 0 && { errors: err.errors }),
    });
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    const validationErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    logger.warn("Validation Error", {
      requestId,
      path: req.originalUrl,
      errors: validationErrors,
    });

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      requestId,
      errors: validationErrors,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    logger.warn(`Cast Error: Invalid ${err.kind} for field ${err.path}`, {
      requestId,
      value: err.value,
    });

    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      requestId,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    logger.warn(`Duplicate key error on field: ${field}`, {
      requestId,
      keyValue: err.keyValue,
    });

    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
      requestId,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    logger.warn("Mongoose Validation Error", { requestId, errors });

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      requestId,
      errors,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please log in again.",
      requestId,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired. Please log in again.",
      requestId,
    });
  }

  // Unhandled errors - log full stack but don't expose to client
  logger.error(`Unhandled Error: ${err.message}`, {
    requestId,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
    requestId,
  });
};

module.exports = errorHandler;
