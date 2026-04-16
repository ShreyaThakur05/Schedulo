const nodemailer = require('nodemailer');
const { env } = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

// Format a UTC ISO string into a human-readable time in the given timezone
function formatInTz(isoString, timezone = 'Asia/Kolkata') {
  return new Date(isoString).toLocaleString('en-IN', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatTimeOnly(isoString, timezone = 'Asia/Kolkata') {
  return new Date(isoString).toLocaleString('en-IN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

async function sendConfirmationEmail(to, data) {
  if (!env.SMTP_HOST) return;
  const tz = data.timezone || 'Asia/Kolkata';
  const dateStr = formatInTz(data.startTime, tz);
  const endTimeStr = formatTimeOnly(data.endTime, tz);
  const tzLabel = tz.replace('_', ' ');

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: `Confirmed: ${data.eventName} with ${data.hostName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#f0f4ff;padding:32px 16px">
        <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #ddd6fe">
          <div style="text-align:center;margin-bottom:24px">
            <div style="width:56px;height:56px;background:#d1fae5;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px">✓</div>
            <h1 style="color:#1e1b4b;font-size:22px;margin:12px 0 4px">You're confirmed!</h1>
            <p style="color:#6b6b8a;font-size:14px;margin:0">Your meeting has been scheduled</p>
          </div>
          <div style="background:#f0f4ff;border-radius:12px;padding:20px;margin-bottom:24px">
            <p style="margin:0 0 8px;font-weight:600;color:#1e1b4b;font-size:15px">${data.eventName}</p>
            <p style="margin:0 0 6px;color:#4b5563;font-size:14px">📅 ${dateStr}</p>
            <p style="margin:0 0 6px;color:#4b5563;font-size:14px">⏱ Ends at ${endTimeStr}</p>
            <p style="margin:0;color:#6b6b8a;font-size:12px">🌍 ${tzLabel}</p>
          </div>
          <p style="color:#4b5563;font-size:14px;margin:0 0 8px">Hi <strong>${data.inviteeName}</strong>,</p>
          <p style="color:#4b5563;font-size:14px;margin:0">Your meeting with <strong>${data.hostName}</strong> is confirmed. See you then!</p>
        </div>
        <p style="text-align:center;color:#9999bb;font-size:12px;margin-top:16px">Scheduled via Calendly</p>
      </div>
    `,
  });
}

async function sendCancellationEmail(to, data) {
  if (!env.SMTP_HOST) return;
  const tz = data.timezone || 'Asia/Kolkata';
  const dateStr = formatInTz(data.startTime, tz);

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: `Cancelled: ${data.eventName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#f0f4ff;padding:32px 16px">
        <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #ddd6fe">
          <h1 style="color:#1e1b4b;font-size:20px;margin:0 0 16px">Meeting Cancelled</h1>
          <p style="color:#4b5563;font-size:14px;margin:0 0 12px">Hi <strong>${data.inviteeName}</strong>,</p>
          <p style="color:#4b5563;font-size:14px;margin:0 0 16px">Your meeting <strong>${data.eventName}</strong> scheduled for <strong>${dateStr}</strong> has been cancelled.</p>
        </div>
        <p style="text-align:center;color:#9999bb;font-size:12px;margin-top:16px">Scheduled via Calendly</p>
      </div>
    `,
  });
}

module.exports = { sendConfirmationEmail, sendCancellationEmail };
