const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
	gender: {
		type: String,
		enum: ["Male", "Female", "Non-Binary", "Prefer not to say", null],
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
		maxlength: 250,
	},
	contactNumber: {
		type: Number,
		trim: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Export the Profile model
module.exports = mongoose.model("Profile", profileSchema);
