require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Category = require("../models/Category");

const categories = [
  { name: "Web Development", description: "Learn HTML, CSS, JavaScript, React, Node.js and more" },
  { name: "Mobile Development", description: "Build iOS and Android apps with React Native, Flutter" },
  { name: "Data Science", description: "Python, Machine Learning, Deep Learning, Data Analysis" },
  { name: "Artificial Intelligence", description: "AI, ML, Neural Networks, NLP, Computer Vision" },
  { name: "Cloud Computing", description: "AWS, Azure, Google Cloud, DevOps, Docker, Kubernetes" },
  { name: "Cybersecurity", description: "Ethical Hacking, Network Security, Penetration Testing" },
  { name: "Database", description: "SQL, MongoDB, PostgreSQL, Redis and more" },
  { name: "UI/UX Design", description: "Figma, Adobe XD, User Research, Wireframing" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created: ${cat.name}`);
      } else {
        console.log(`Already exists: ${cat.name}`);
      }
    }

    console.log("Done! Categories seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seed();
