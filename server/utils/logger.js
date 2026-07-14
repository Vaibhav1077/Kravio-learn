const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const COLORS = {
  ERROR: "\x1b[31m", // Red
  WARN: "\x1b[33m",  // Yellow
  INFO: "\x1b[36m",  // Cyan
  DEBUG: "\x1b[90m", // Gray
  RESET: "\x1b[0m",
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

/**
 * Format timestamp for log output
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

/**
 * Format a log message with metadata
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 */
const formatMessage = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  const color = COLORS[level] || COLORS.RESET;
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : "";
  return `${color}[${timestamp}] [${level}]${COLORS.RESET} ${message}${metaStr}`;
};

const logger = {
  error(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.ERROR) {
      console.error(formatMessage("ERROR", message, meta));
    }
  },

  warn(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.WARN) {
      console.warn(formatMessage("WARN", message, meta));
    }
  },

  info(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.log(formatMessage("INFO", message, meta));
    }
  },

  debug(message, meta = {}) {
    if (currentLevel >= LOG_LEVELS.DEBUG) {
      console.log(formatMessage("DEBUG", message, meta));
    }
  },

  /**
   * Log an HTTP request (for use as middleware)
   */
  requestLogger(req, res, next) {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    res.on("finish", () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const level = statusCode >= 500 ? "ERROR" : statusCode >= 400 ? "WARN" : "INFO";
      
      logger[level.toLowerCase()](`${method} ${originalUrl} ${statusCode} - ${duration}ms`, {
        ip,
        userAgent: req.get("User-Agent")?.substring(0, 80),
      });
    });

    next();
  },
};

module.exports = logger;
