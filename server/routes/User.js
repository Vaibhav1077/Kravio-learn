const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  signupSchema,
  loginSchema,
  sendOtpSchema,
  changePasswordSchema,
  resetPasswordTokenSchema,
  resetPasswordSchema,
} = require("../validations/auth.validation");

// ==========================================
//         Authentication Routes
// ==========================================

// Public routes - no auth required
router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signupSchema), signup);
router.post("/sendotp", validate(sendOtpSchema), sendotp);

// Protected routes - require authentication
router.post("/changepassword", auth, validate(changePasswordSchema), changePassword);

// Password reset flow (public - uses token-based verification)
router.post("/reset-password-token", validate(resetPasswordTokenSchema), resetPasswordToken);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = router;
