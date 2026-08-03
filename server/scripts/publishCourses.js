require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Course = require("../models/Course");

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const result = await Course.updateMany({ status: "Draft" }, { status: "Published" });
  console.log(`Published ${result.modifiedCount} course(s)`);
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
