/**
 * Convert total seconds to a human-readable duration format
 * @param {number} totalSeconds - Total duration in seconds
 * @returns {string} Formatted duration string (e.g., "2h 30m", "45m 10s", "30s")
 */
function convertSecondsToDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return "0s"

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor((totalSeconds % 3600) % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

module.exports = {
  convertSecondsToDuration,
}