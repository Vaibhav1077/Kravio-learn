const mongoose = require("mongoose")

const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index for efficient lookups
courseProgressSchema.index({ courseID: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("courseProgress", courseProgressSchema)