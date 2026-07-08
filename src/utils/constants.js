export const ACCOUNT_TYPE = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  ADMIN: "Admin",
}

export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
}

// Breakpoints matching Tailwind defaults
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
}

// Maximum file sizes for uploads (in bytes)
export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  THUMBNAIL: 2 * 1024 * 1024, // 2MB
}