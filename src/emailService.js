// ============================================================================
// Email Service — Sends emails via Brevo SMTP using Nodemailer
// ============================================================================
const nodemailer = require('nodemailer');
const config = require('./config');

let transporter = null;

/**
 * Initializes the SMTP transporter (Brevo).
 */
function initEmailService() {
  if (!config.smtp.user || !config.smtp.pass) {
    console.warn('[EmailService] SMTP credentials not configured. Emails will be logged only.');
    return;
  }

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  console.log(`[EmailService] SMTP transporter configured: ${config.smtp.host}:${config.smtp.port}`);
}

/**
 * Sends an email. Retries up to 3 times with exponential backoff.
 */
async function sendEmail(to, subject, htmlBody) {
  const mailOptions = {
    from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
    to,
    subject,
    html: htmlBody,
  };

  if (!transporter) {
    console.log(`[EmailService][SIMULATED] To: ${to} | Subject: ${subject}`);
    console.log(`[EmailService][SIMULATED] Body: ${htmlBody.substring(0, 200)}...`);
    return { simulated: true };
  }

  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Email sent to ${to} — messageId: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[EmailService] Attempt ${attempt}/${MAX_RETRIES} failed for ${to}: ${error.message}`);
      if (attempt === MAX_RETRIES) {
        console.error(`[EmailService] All ${MAX_RETRIES} attempts failed. Skipping email to ${to}.`);
        throw error;
      }
      // Exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
  }
}

module.exports = { initEmailService, sendEmail };
