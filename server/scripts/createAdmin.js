require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Profile = require("../models/Profile");

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const email = "admin@kravio.com";
  const password = "Admin@1234";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const profile = await Profile.create({
    gender: null,
    dateOfBirth: null,
    about: "Platform Administrator",
    contactNumber: null,
  });

  await User.create({
    firstName: "Admin",
    lastName: "Kravio",
    email,
    password: hashedPassword,
    accountType: "Admin",
    approved: true,
    active: true,
    additionalDetails: profile._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=Admin Kravio`,
  });

  console.log("✅ Admin created successfully!");
  console.log("Email:", email);
  console.log("Password:", password);
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
