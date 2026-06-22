const Razorpay = require("razorpay");

let instance = null;

/**
 * Initialize Razorpay instance
 * Payment features will be disabled if keys are not configured
 */
if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET) {
  instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  console.log("Razorpay payment gateway initialized");
} else {
  console.warn("Warning: Razorpay keys not set. Payment features will be disabled.");
}

exports.instance = instance;