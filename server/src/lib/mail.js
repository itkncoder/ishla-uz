import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  return transporter
}

/**
 * Send OTP code to the given email.
 */
export async function sendOtpEmail(email, code) {
  const mail = getTransporter()

  await mail.sendMail({
    from: process.env.SMTP_FROM || `"ISHLA.UZ" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${code} — Tasdiqlash kodi | ISHLA.UZ`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 440px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
            <span style="color: #374151;">ISHLA</span><span style="color: #004AAD;">.UZ</span>
          </span>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Tasdiqlash kodi:</p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #004AAD; margin: 16px 0;">
            ${code}
          </div>
          <p style="color: #9ca3af; font-size: 13px; margin: 16px 0 0;">Kod 5 daqiqa ichida amal qiladi</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
          Agar siz bu kodni so'ramagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.
        </p>
      </div>
    `,
    text: `Sizning tasdiqlash kodingiz: ${code}\n\nKod 5 daqiqa ichida amal qiladi.\n\nAgar siz bu kodni so'ramagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.`,
  })
}
