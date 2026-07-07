const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

const generateToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user._id, accountType: user.accountType },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, accountType, contactNumber, otp } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }
    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved: true,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      user: userResponse,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.cookie("token", token, COOKIE_OPTIONS).status(200).json({
      success: true,
      token,
      user: userResponse,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

exports.sendotp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User is already registered.",
      });
    }

    let otp;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const existing = await OTP.findOne({ otp });
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate OTP. Please try again.",
      });
    }

    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userDetails = await User.findById(req.user.id).select("+password");
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(req.user.id, { password: encryptedPassword });

    try {
      await mailSender(
        userDetails.email,
        "Password Updated",
        passwordUpdated(
          userDetails.email,
          `Password updated successfully for ${userDetails.firstName} ${userDetails.lastName}`
        )
      );
    } catch (_emailError) {
      // Non-critical: password was changed, email notification failed
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};
