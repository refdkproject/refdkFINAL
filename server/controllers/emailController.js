import asyncHandler from "../middleware/asyncHandler.js"
import sendEmail from "../services/emailService.js"

// @desc    Send email
// @route   POST /api/email/send
// @access  Private/Admin
const sendMailController = asyncHandler(async (req, res) => {
  const { to, subject, content, attachments } = req.body

  // Validate attachments
  const processedAttachments = Array.isArray(attachments)
    ? attachments.map(attachment => ({
        filename: attachment.name,
        content: attachment.content,
        encoding: 'base64',
        contentType: attachment.contentType
      }))
    : [];

  // Validate total attachment size (e.g., 10MB limit)
  const totalSize = processedAttachments.reduce((sum, attachment) => {
    const sizeInBytes = Buffer.from(attachment.content, 'base64').length;
    return sum + sizeInBytes;
  }, 0);

  if (totalSize > 10 * 1024 * 1024) { // 10MB limit
    return res.status(400).json({
      success: false,
      message: "Total attachment size exceeds 10MB limit"
    });
  }

  const result = await sendEmail({
    to,
    subject,
    html: content,
    attachments: processedAttachments
  })

  if (result.success) {
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: { messageId: result.messageId },
    })
  } else {
    res.status(500).json({
      success: false,
      message: result.error,
      data: null,
    })
  }
})

export { sendMailController }
