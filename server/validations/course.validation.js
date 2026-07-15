const { z } = require("zod");

const createCourseSchema = z.object({
  courseName: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name cannot exceed 100 characters")
    .trim(),
  courseDescription: z
    .string()
    .min(10, "Course description must be at least 10 characters")
    .max(2000, "Course description cannot exceed 2000 characters")
    .trim(),
  whatYouWillLearn: z
    .string()
    .min(10, "Learning outcomes must be at least 10 characters")
    .trim(),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a valid non-negative number",
    }),
  tag: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    },
    { message: "Tags must be a valid JSON array with at least one tag" }
  ),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Draft", "Published"]).optional().default("Draft"),
  instructions: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    },
    { message: "Instructions must be a valid JSON array with at least one item" }
  ),
});

const editCourseSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  courseName: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name cannot exceed 100 characters")
    .trim()
    .optional(),
  courseDescription: z
    .string()
    .min(10, "Course description must be at least 10 characters")
    .max(2000, "Course description cannot exceed 2000 characters")
    .trim()
    .optional(),
  whatYouWillLearn: z.string().trim().optional(),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a valid non-negative number",
    })
    .optional(),
  tag: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["Draft", "Published"]).optional(),
  instructions: z.string().optional(),
});

const courseIdSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

const createSectionSchema = z.object({
  sectionName: z
    .string()
    .min(1, "Section name is required")
    .max(100, "Section name cannot exceed 100 characters")
    .trim(),
  courseId: z.string().min(1, "Course ID is required"),
});

const updateSectionSchema = z.object({
  sectionName: z
    .string()
    .min(1, "Section name is required")
    .max(100, "Section name cannot exceed 100 characters")
    .trim(),
  sectionId: z.string().min(1, "Section ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
});

const deleteSectionSchema = z.object({
  sectionId: z.string().min(1, "Section ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
});

const createRatingSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  review: z
    .string()
    .min(1, "Review is required")
    .max(500, "Review cannot exceed 500 characters")
    .trim(),
  courseId: z.string().min(1, "Course ID is required"),
});

module.exports = {
  createCourseSchema,
  editCourseSchema,
  courseIdSchema,
  createSectionSchema,
  updateSectionSchema,
  deleteSectionSchema,
  createRatingSchema,
};
