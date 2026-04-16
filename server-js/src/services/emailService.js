const nodemailer = require('nodemailer');
const { env } = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

async function sendConfirmationEmail(to, data) {
  if (!env.SMTP_HOST) return;
  await transporter.sendMail({
    from: env.SMTP_FROM, to,
    subject: `Confirmed: ${data.eventName}`,
    html: `<p>Hi ${data.inviteeName},</p><p>Your meeting <strong>${data.eventName}</strong> with ${data.hostName} is confirmed.</p><p><strong>When:</strong> ${new Date(data.startTime).toLocaleString()}</p>`,
  });
}

async function sendCancellationEmail(to, data) {
  if (!env.SMTP_HOST) return;
  await transporter.sendMail({
    from: env.SMTP_FROM, to,
    subject: `Cancelled: ${data.eventName}`,
    html: `<p>Hi ${data.inviteeName},</p><p>Your meeting <strong>${data.eventName}</strong> on ${new Date(data.startTime).toLocaleString()} has been cancelled.</p>`,
  });
}

module.exports = { sendConfirmationEmail, sendCancellationEmail };
