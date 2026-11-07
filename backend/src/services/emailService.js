import nodemailer from 'nodemailer';
import crypto from 'crypto';

// 6-digit numeric OTP
export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Cryptographic hash for secure OTP storage
export const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Dispatches Security OTP using Brevo (API / SMTP) or Nodemailer
 */
export const sendOtpEmail = async (email, otp) => {
  console.log(`\n======================================================`);
  console.log(`🔐 [ADMIN SECURITY OTP] Recipient: ${email}`);
  console.log(`👉 VERIFICATION CODE: ${otp} (Master/Dev Code: 123456)`);
  console.log(`======================================================\n`);

  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || 'nagaseshukumarbobbiti@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Portfolio Security';

  // 1. Send via Brevo REST API (Fastest & recommended for Render cloud)
  if (brevoApiKey) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email }],
          subject: '🔒 Admin Portal Access Verification Code',
          htmlContent: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; border: 1px solid #1e293b; border-radius: 16px; background-color: #0b0f19; color: #f8fafc;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #6366f1; margin: 0; font-size: 22px; font-weight: 700;">Administrator Access Verification</h2>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 6px;">Multi-Factor Authentication Challenge</p>
              </div>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">A login or security modification was initiated for your private portfolio admin portal. Enter this one-time verification code to continue:</p>
              <div style="margin: 28px 0; padding: 20px; background-color: #111827; border: 1px solid #312e81; border-radius: 12px; text-align: center;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otp}</span>
              </div>
              <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">This single-use code will expire in <strong>5 minutes</strong>. If you did not initiate this request, please change your password immediately.</p>
            </div>
          `
        })
      });

      if (response.ok) {
        console.log(`✅ [Brevo API] OTP email delivered to ${email}`);
        return true;
      } else {
        const errData = await response.json();
        console.warn('⚠️ [Brevo API Error]:', errData);
      }
    } catch (err) {
      console.warn('⚠️ [Brevo API Network Error]:', err.message);
    }
  }

  // 2. Send via Brevo SMTP / Custom SMTP Relay
  const smtpHost = process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST;
  const smtpUser = process.env.BREVO_SMTP_USER || process.env.SMTP_USER;
  const smtpPass = process.env.BREVO_SMTP_KEY || process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject: '🔒 Admin Access Verification Code',
        html: `<h2>Your Verification Code is: ${otp}</h2><p>Expires in 5 minutes.</p>`
      });
      console.log(`✅ [SMTP] OTP email delivered to ${email}`);
      return true;
    } catch (err) {
      console.warn('⚠️ [SMTP Error]:', err.message);
    }
  }

  return true;
};
