const mongoose = require("mongoose");

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
	courseName: { type: String, required: true, trim: true },
	courseDescription: { type: String, required: true },
	instructor: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	whatYouWillLearn: {
		type: String,
	},
	courseContent: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
	],
	ratingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "RatingAndReview",
		},
	],
	price: {
		type: Number,
		default: 0,
	},
	thumbnail: {
		type: String,
	},
	tag: {
		type: [String],
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
	},
	studentsEnroled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "user",
		},
	],
	instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
		default: "Draft",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Add indexes for frequently queried fields
coursesSchema.index({ status: 1, createdAt: -1 });
coursesSchema.index({ instructor: 1 });
coursesSchema.index({ category: 1 });

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema);