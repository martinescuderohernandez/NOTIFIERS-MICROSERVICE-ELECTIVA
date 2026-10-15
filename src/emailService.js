
const nodemailer = require('nodemailer');
const config = require('./config');

let transporter = null;
let mode = 'simulated';


function initEmailService() {
  if (config.brevo.apiKey) {
    mode = 'api';
    console.log('[EmailService] Using Brevo HTTP API (HTTPS:443)');
    return;
  }

  if (!config.smtp.user || !config.smtp.pass) {
    console.warn('[EmailService] No BREVO_API_KEY nor SMTP credentials. Emails will be logged only.');
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
    connectionTimeout: 15000,
  });
  mode = 'smtp';

  console.log(`[EmailService] SMTP transporter configured: ${config.smtp.host}:${config.smtp.port}`);
}


async function sendViaApi(to, subject, htmlBody) {
  const response = await fetch(config.brevo.apiUrl, {
    method: 'POST',
    headers: {
      'api-key': config.brevo.apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: config.smtp.fromName, email: config.smtp.fromEmail },
      to: [{ email: to }],
      subject,
      htmlContent: htmlBody,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Brevo API ${response.status}: ${body.message || JSON.stringify(body)}`);
  }
  return { messageId: body.messageId };
}


async function sendEmail(to, subject, htmlBody) {
  if (mode === 'simulated') {
    console.log(`[EmailService][SIMULATED] To: ${to} | Subject: ${subject}`);
    console.log(`[EmailService][SIMULATED] Body: ${htmlBody.substring(0, 200)}...`);
    return { simulated: true };
  }

  const mailOptions = {
    from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
    to,
    subject,
    html: htmlBody,
  };

  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const info = mode === 'api'
        ? await sendViaApi(to, subject, htmlBody)
        : await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Email sent to ${to} via ${mode} — messageId: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[EmailService] Attempt ${attempt}/${MAX_RETRIES} failed for ${to}: ${error.message}`);
      if (attempt === MAX_RETRIES) {
        console.error(`[EmailService] All ${MAX_RETRIES} attempts failed. Skipping email to ${to}.`);
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
    }
  }
}

function getEmailMode() {
  return mode;
}

module.exports = { initEmailService, sendEmail, getEmailMode };
