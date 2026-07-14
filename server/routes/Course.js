// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course")


// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview")

const {
  updateCourseProgress
} = require("../controllers/courseProgress");

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
const validate = require("../middlewares/validate")

// Importing Validation Schemas
const {
  createCourseSchema,
  editCourseSchema,
  courseIdSchema,
  createSectionSchema,
  updateSectionSchema,
  deleteSectionSchema,
  createRatingSchema,
} = require("../validations/course.validation")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, validate(createCourseSchema), createCourse)
// Add a Section to a Course
router.post("/addSection", auth, isInstructor, validate(createSectionSchema), createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, validate(updateSectionSchema), updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, validate(deleteSectionSchema), deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", validate(courseIdSchema), getCourseDetails)
// Get Full Course Details (authenticated)
router.post("/getFullCourseDetails", auth, validate(courseIdSchema), getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, validate(editCourseSchema), editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", auth, isInstructor, validate(courseIdSchema), deleteCourse)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, validate(createRatingSchema), createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router