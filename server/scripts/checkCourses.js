require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Course = require("../models/Course");

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const courses = await Course.find({}, "courseName status");
  console.log("Total courses:", courses.length);
  courses.forEach(c => console.log(`- ${c.courseName} [${c.status}]`));
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
