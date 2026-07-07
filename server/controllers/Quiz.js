const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Course = require("../models/Course");

// ============ INSTRUCTOR ENDPOINTS ============

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, courseId, timeLimit, passingScore } = req.body;
    const instructorId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor.toString() !== instructorId) {
      return res.status(403).json({ success: false, message: "You can only create quizzes for your own courses" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      course: courseId,
      instructor: instructorId,
      timeLimit,
      passingScore: passingScore || 50,
      questions: [],
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { quizId, title, description, timeLimit, passingScore, isPublished } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (title !== undefined) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (timeLimit !== undefined) quiz.timeLimit = timeLimit;
    if (passingScore !== undefined) quiz.passingScore = passingScore;
    if (isPublished !== undefined) quiz.isPublished = isPublished;

    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await QuizAttempt.deleteMany({ quiz: quizId });
    await Quiz.findByIdAndDelete(quizId);

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { quizId, questionText, options, correctOption, points } = req.body;

    if (!questionText || !options || options.length < 2 || correctOption === undefined) {
      return res.status(400).json({ success: false, message: "Question requires text, at least 2 options, and a correct option index" });
    }

    if (correctOption < 0 || correctOption >= options.length) {
      return res.status(400).json({ success: false, message: "Correct option index is out of range" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    quiz.questions.push({
      questionText,
      options,
      correctOption,
      points: points || 1,
    });

    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Question added successfully",
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (quiz.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    quiz.questions = quiz.questions.filter(
      (q) => q._id.toString() !== questionId
    );
    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Question removed successfully",
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInstructorQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ instructor: req.user.id })
      .populate("course", "courseName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.body;

    const quiz = await Quiz.findById(quizId).populate("course", "courseName");
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizAnalytics = async (req, res) => {
  try {
    const { quizId } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.instructor.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const attempts = await QuizAttempt.find({ quiz: quizId })
      .populate("student", "firstName lastName email image")
      .sort({ createdAt: -1 });

    const totalAttempts = attempts.length;
    const passedCount = attempts.filter((a) => a.passed).length;
    const avgScore = totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        quiz: { title: quiz.title, passingScore: quiz.passingScore },
        stats: {
          totalAttempts,
          passedCount,
          failedCount: totalAttempts - passedCount,
          averageScore: Math.round(avgScore * 100) / 100,
          passRate: totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0,
        },
        attempts,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============ STUDENT ENDPOINTS ============

exports.getQuizzesForCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const quizzes = await Quiz.find({ course: courseId, isPublished: true })
      .select("title description timeLimit passingScore questions createdAt")
      .lean();

    const quizzesWithMeta = quizzes.map((q) => ({
      _id: q._id,
      title: q.title,
      description: q.description,
      timeLimit: q.timeLimit,
      passingScore: q.passingScore,
      totalQuestions: q.questions.length,
      totalPoints: q.questions.reduce((sum, question) => sum + question.points, 0),
      createdAt: q.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: quizzesWithMeta,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.startQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;
    const studentId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.isPublished) {
      return res.status(404).json({ success: false, message: "Quiz not found or not published" });
    }

    // Return questions without correct answers
    const questions = quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      points: q.points,
    }));

    return res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        title: quiz.title,
        timeLimit: quiz.timeLimit,
        questions,
        startedAt: new Date(),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, startedAt, timeExpired } = req.body;
    const studentId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Server-side time validation
    const startTime = new Date(startedAt).getTime();
    const now = Date.now();
    const elapsed = (now - startTime) / 1000 / 60; // minutes

    // Allow 30 second grace period for network latency
    if (elapsed > quiz.timeLimit + 0.5) {
      return res.status(400).json({
        success: false,
        message: "Quiz time has expired. Submission rejected.",
      });
    }

    // Grade the quiz
    let score = 0;
    let totalPoints = 0;

    const gradedAnswers = quiz.questions.map((question) => {
      totalPoints += question.points;

      const studentAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      const selectedOption = studentAnswer ? studentAnswer.selectedOption : -1;
      const isCorrect = selectedOption === question.correctOption;
      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;

      return {
        questionId: question._id,
        selectedOption,
        isCorrect,
        pointsEarned,
      };
    });

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = percentage >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      quiz: quizId,
      student: studentId,
      answers: gradedAnswers,
      score,
      totalPoints,
      percentage: Math.round(percentage * 100) / 100,
      passed,
      startedAt: new Date(startedAt),
      submittedAt: new Date(),
      timeExpired: timeExpired || false,
    });

    return res.status(200).json({
      success: true,
      message: passed ? "Congratulations! You passed the quiz." : "Quiz submitted. Better luck next time!",
      data: {
        attemptId: attempt._id,
        score,
        totalPoints,
        percentage: attempt.percentage,
        passed,
        answers: gradedAnswers,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizHistory = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attempts = await QuizAttempt.find({ student: studentId })
      .populate({
        path: "quiz",
        select: "title course timeLimit passingScore",
        populate: { path: "course", select: "courseName" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.body;
    const studentId = req.user.id;

    const attempt = await QuizAttempt.findById(attemptId).populate({
      path: "quiz",
      select: "title questions timeLimit passingScore",
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: "Attempt not found" });
    }

    if (attempt.student.toString() !== studentId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
