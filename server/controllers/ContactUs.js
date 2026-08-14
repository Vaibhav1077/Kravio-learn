const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body

  // Validate required fields
  if (!email || !firstname || !message) {
    return res.status(400).json({
      success: false,
      message: "Email, first name, and message are required fields",
    })
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    })
  }

  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Email Res ", emailRes)
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error.message)
    return res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    })
  }
}