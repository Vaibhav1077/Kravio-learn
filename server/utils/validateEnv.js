const requiredVars = [
  "MONGODB_URL",
  "JWT_SECRET",
  "MAIL_HOST",
  "MAIL_USER",
  "MAIL_PASS",
  "CLOUD_NAME",
  "API_KEY",
  "API_SECRET",
  "FOLDER_NAME",
];

const optionalVars = [
  "RAZORPAY_KEY",
  "RAZORPAY_SECRET",
];

const validateEnv = () => {
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
  const missingOptional = optionalVars.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(`Warning: Optional env vars not set (some features disabled): ${missingOptional.join(", ")}`);
  }
};

module.exports = validateEnv;
