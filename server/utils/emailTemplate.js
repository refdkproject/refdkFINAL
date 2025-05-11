const getEmailTemplate = (resetURL) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
  </style>
</head>
<body style="font-family: 'Poppins', sans-serif; background-color: #f3f4f6; margin: 0; padding: 100px;">
  <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden;">
    <header style="background-color: #397260; padding: 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
        <span style="color: #c5e1d4;">Refdks</span>
      </h1>
    </header>

    <main style="padding: 32px; text-align: center; align-items: center;">
      <h2 style="color: #1f2937; text-align: center; font-size: 20px; font-weight: 600;">
        Password Reset Request
      </h2>

      <p style="color: #4b5563; text-align: center; line-height: 1.5;">
        We received a request to reset your account password. Click the button below to set up a new password:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetURL}"
           style="display: inline-block; background-color: #397260; color: white;
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-weight: 600; transition: background-color 0.3s;">
          Reset Password
        </a>
      </div>

      <p style="color: #4b5563; margin: 16px; text-align: center; line-height: 1.5; font-size: 14px;">
        This link will expire in 10 minutes.
      </p>
      <small style="color: #4b5563; margin: 18px; text-align: center; line-height: 1.5;">
        If you didn't request this password reset,
        you can safely ignore this email.
      </small>
    </main>

    <footer style="background-color: #f9fafb; padding: 24px; text-align: center;">
      <p style="color: #6b7280; margin: 0; font-size: 12px; line-height: 1.5;">
        Need help? Contact our support team at
        <a href="mailto:support@refdks.com"
           style="color: #397260; text-decoration: none;">support@refdks.com</a>
      </p>
      <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 12px;">
        © 2025 Refdks. All rights reserved.
      </p>
    </footer>
  </div>
</body>
</html>
`

export default getEmailTemplate
