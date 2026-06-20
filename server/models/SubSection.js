const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	timeDuration: { type: String },
	description: { type: String },
	videoUrl: { type: String, required: true },
});

// Virtual for formatted duration
SubSectionSchema.virtual("formattedDuration").get(function () {
	const seconds = parseInt(this.timeDuration) || 0;
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
});

module.exports = mongoose.model("SubSection", SubSectionSchema);