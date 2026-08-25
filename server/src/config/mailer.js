import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

// Sends the OTP email. If SMTP isn't configured (local dev without a
// mail provider set up yet), falls back to logging the OTP to the
// server console so the flow is still testable end to end.
export async function sendOtpEmail(to, otp) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[dev fallback] SMTP not configured. OTP for ${to}: ${otp}`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Your Quest Dental Products verification code',
    text: `Your verification code is ${otp}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
  });
}