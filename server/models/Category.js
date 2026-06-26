const mongoose = require("mongoose");

// Define the Category schema
const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	description: {
		type: String,
		trim: true,
	},
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
	],
});

// Index for fast lookups by name
categorySchema.index({ name: 1 });

// Export the Category model
module.exports = mongoose.model("Category", categorySchema);