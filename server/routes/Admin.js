const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth");
const {
  getPlatformStats,
  getAllUsers,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  deleteCategory,
} = require("../controllers/Admin");
const { createCategory } = require("../controllers/Category");

router.get("/stats", auth, isAdmin, getPlatformStats);
router.get("/users", auth, isAdmin, getAllUsers);
router.delete("/users", auth, isAdmin, deleteUser);
router.get("/courses", auth, isAdmin, getAllCoursesAdmin);
router.delete("/courses", auth, isAdmin, deleteCourseAdmin);
router.post("/categories", auth, isAdmin, createCategory);
router.delete("/categories", auth, isAdmin, deleteCategory);

module.exports = router;
