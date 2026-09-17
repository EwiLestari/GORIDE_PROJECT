import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Default using ethereal or standard smtp depending on env
// If using Resend, you'd use the Resend SDK here instead
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user',
    pass: process.env.SMTP_PASS || 'ethereal_pass'
  }
});

export const sendLateReturnReminder = async (userEmail, userName, motorcycleName, endDate) => {
  try {
    const mailOptions = {
      from: '"Go Ride Admin" <admin@goride.com>',
      to: userEmail,
      subject: 'Urgent: Overdue Motorcycle Return',
      text: `Hello ${userName},\n\nThis is a friendly reminder that your rental for ${motorcycleName} was due on ${new Date(endDate).toLocaleString()}.\n\nPlease return it immediately. Late fees are accumulating at our standard hourly rate.\n\nThank you,\nGo Ride Team`,
      html: `
        <h3>Hello ${userName},</h3>
        <p>This is a reminder that your rental for <strong>${motorcycleName}</strong> was due on <strong>${new Date(endDate).toLocaleString()}</strong>.</p>
        <p style="color: red;">Please return it immediately. Late fees are accumulating at our standard hourly rate.</p>
        <br/>
        <p>Thank you,</p>
        <p>Go Ride Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reminder email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: '"Go Ride Admin" <admin@goride.com>',
      to: userEmail,
      subject: 'Password Reset Request',
      text: `Hello,\n\nYou requested a password reset. Please click the link below to reset your password:\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #f97316; margin-bottom: 20px;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You recently requested to reset your password for your Go Ride account. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 15 minutes.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">Go Ride Team &copy; ${new Date().getFullYear()}</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending reset email:', error);
    return false;
  }
};
