/**
 * Format a date string to a verbose format with time
 * @param {string} dateString - ISO date string or valid Date input
 * @returns {string} Formatted string like "July 12, 2026 | 3:00 PM"
 */
export const formatDate = (dateString) => {
  if (!dateString) return ""

  const options = { year: "numeric", month: "long", day: "numeric" }
  const date = new Date(dateString)

  if (isNaN(date.getTime())) return "Invalid date"

  const formattedDate = date.toLocaleDateString("en-US", options)

  const hour = date.getHours()
  const minutes = date.getMinutes()
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  const formattedTime = `${displayHour}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`

  return `${formattedDate} | ${formattedTime}`
}