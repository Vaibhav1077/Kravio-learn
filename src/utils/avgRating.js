/**
 * Calculate the average rating from an array of rating objects
 * @param {Array} ratingArr - Array of objects with a `rating` property
 * @returns {number} Average rating rounded to 1 decimal place, or 0 if empty
 */
export default function GetAvgRating(ratingArr) {
  if (!ratingArr || ratingArr.length === 0) return 0

  const totalReviewCount = ratingArr.reduce((acc, curr) => {
    acc += curr.rating
    return acc
  }, 0)

  const multiplier = Math.pow(10, 1)
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr.length) * multiplier) / multiplier

  return avgReviewCount
}