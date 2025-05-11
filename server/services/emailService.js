import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendEmail = async ({ to, subject, html }, retries = 3, delay = 2000) => {
  const mailOptions = {
    from: `"Refdks" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  }

  for (let i = 0; i < retries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions)
      console.log(`Email sent successfully on attempt ${i + 1}`)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error)
      if (i === retries - 1) {
        console.error(`Failed to send email after ${retries} attempts:`, error)
        return { success: false, error: error.message }
      }
      console.log(
        `Email sending attempt ${i + 1} failed. Retrying in ${
          delay / 1000
        } seconds...`
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Add a verification function to test the connection
const verifyConnection = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.verify()
      console.log("Email service connection verified successfully")
      return true
    } catch (error) {
      if (i === retries - 1) {
        console.error(
          `Failed to verify email service after ${retries} attempts:`,
          error
        )
        return false
      }
      console.log(
        `Verification attempt ${i + 1} failed. Retrying in ${
          delay / 1000
        } seconds...`
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Verify connection when service starts
verifyConnection()

export default sendEmail
