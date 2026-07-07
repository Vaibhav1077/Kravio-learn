const express = require("express");
const router = express.Router();

const {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  removeQuestion,
  getInstructorQuizzes,
  getQuizDetails,
  getQuizAnalytics,
  getQuizzesForCourse,
  startQuiz,
  submitQuiz,
  getQuizHistory,
  getAttemptDetails,
} = require("../controllers/Quiz");

const { auth, isInstructor, isStudent } = require("../middlewares/auth");

// ============ Instructor Routes ============
router.post("/create", auth, isInstructor, createQuiz);
router.post("/update", auth, isInstructor, updateQuiz);
router.post("/delete", auth, isInstructor, deleteQuiz);
router.post("/add-question", auth, isInstructor, addQuestion);
router.post("/remove-question", auth, isInstructor, removeQuestion);
router.get("/instructor-quizzes", auth, isInstructor, getInstructorQuizzes);
router.post("/details", auth, getQuizDetails);
router.post("/analytics", auth, isInstructor, getQuizAnalytics);

// ============ Student Routes ============
router.post("/course-quizzes", auth, isStudent, getQuizzesForCourse);
router.post("/start", auth, isStudent, startQuiz);
router.post("/submit", auth, isStudent, submitQuiz);
router.get("/history", auth, isStudent, getQuizHistory);
router.post("/attempt-details", auth, isStudent, getAttemptDetails);

module.exports = router;
