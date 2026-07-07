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
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 4000;

database.connect();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/quiz", quizRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Kravio Learn API is running",
  });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
