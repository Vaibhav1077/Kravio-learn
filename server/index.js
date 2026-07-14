const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Fix DNS resolution for MongoDB Atlas on restrictive networks
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const validateEnv = require("./utils/validateEnv");
validateEnv();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const quizRoutes = require("./routes/Quiz");
const adminRoutes = require("./routes/Admin");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./utils/logger");
const { apiLimiter, authLimiter } = require("./middlewares/rateLimiter");

const PORT = process.env.PORT || 4000;

// Connect to database
database.connect();

// Security & parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: require("os").tmpdir(),
  })
);

// Request logging middleware
app.use(logger.requestLogger);

// Apply general rate limiter to all API routes
app.use("/api/", apiLimiter);

// Apply stricter rate limiter to auth routes
app.use("/api/v1/auth", authLimiter);

// Connect to Cloudinary
cloudinaryConnect();

// Response headers middleware - API metadata
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Kravio Learn");
  res.setHeader("X-API-Version", "1.0.0");
  res.setHeader("X-Request-Timestamp", new Date().toISOString());
  next();
});

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Kravio Learn API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  return res.status(200).json({
    success: true,
    message: "OK",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
    },
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized error handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || "development",
    port: PORT,
  });
});
