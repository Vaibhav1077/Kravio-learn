const mongoose = require("mongoose");

const DB_OPTIONS = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, DB_OPTIONS)
    .then(() => console.log("Database connected successfully"))
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
};
