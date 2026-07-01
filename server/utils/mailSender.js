const nodemailer = require("nodemailer");

/**
 * Send an email using nodemailer
 * @param {string} email - Recipient email address
 * @param {string} title - Email subject
 * @param {string} body - HTML email body
 * @returns {Promise<Object>} Nodemailer send info
 */
const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // Connection timeout settings
      connectionTimeout: 10000,
      greetingTimeout: 5000,
    });

    const info = await transporter.sendMail({
      from: `"Kravio Learn" <${process.env.MAIL_USER || "noreply@kravio.com"}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Mail sender error:", error.message);
    throw error;
  }
};

module.exports = mailSender;