/**
 * Format a date string to a readable format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "July 11, 2026")
 */
export const formattedDate = (date) => {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Get relative time string (e.g., "2 days ago", "just now")
 * @param {string|Date} date - Date to compare against now
 * @returns {string} Relative time string
 */
export const timeAgo = (date) => {
  if (!date) return ""
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`
    }
  }
  return "just now"
}