const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selectedOption: {
    type: Number,
    default: -1,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
});

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
    },
    timeExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ quiz: 1, student: 1 });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
