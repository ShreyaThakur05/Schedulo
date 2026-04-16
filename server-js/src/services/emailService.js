const nodemailer = require('nodemailer');
const { env } = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

function formatInTz(isoString, timezone = 'Asia/Kolkata') {
  return new Date(isoString).toLocaleString('en-IN', {
    timeZone: timezone,
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}
function formatTimeOnly(isoString, timezone = 'Asia/Kolkata') {
  return new Date(isoString).toLocaleString('en-IN', {
    timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

// Shared email wrapper — Calendly-style blue header
function emailWrapper({ icon, iconBg, title, subtitle, bodyHtml }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#006BFF 0%,#0052CC 100%);border-radius:16px 16px 0 0;padding:32px 32px 28px;text-align:center">
          <div style="width:64px;height:64px;background:${iconBg};border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:30px;margin-bottom:16px">${icon}</div>
          <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 6px;letter-spacing:-0.3px">${title}</h1>
          <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0">${subtitle}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;border-radius:0 0 16px 16px;padding:32px;border:1px solid #ddd6fe;border-top:none">
          ${bodyHtml}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 0;text-align:center">
          <p style="color:#9999bb;font-size:12px;margin:0">Powered by <strong style="color:#006BFF">Calendly</strong></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailsCard(rows) {
  const rowsHtml = rows.map(([icon, label, value]) => `
    <tr>
      <td style="padding:8px 0;vertical-align:top;width:28px;font-size:16px">${icon}</td>
      <td style="padding:8px 0;vertical-align:top">
        <span style="color:#9999bb;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:2px">${label}</span>
        <span style="color:#1e1b4b;font-size:14px;font-weight:500">${value}</span>
      </td>
    </tr>`).join('');
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;border-radius:12px;padding:20px 20px 12px;margin-bottom:24px">
      ${rowsHtml}
    </table>`;
}

async function sendConfirmationEmail(to, data) {
  if (!env.SMTP_HOST) return;
  const tz = data.timezone || 'Asia/Kolkata';
  const dateStr = formatInTz(data.startTime, tz);
  const endStr = formatTimeOnly(data.endTime, tz);

  await transporter.sendMail({
    from: env.SMTP_FROM, to,
    subject: `✅ Confirmed: ${data.eventName} with ${data.hostName}`,
    html: emailWrapper({
      icon: '✓', iconBg: 'rgba(255,255,255,0.25)',
      title: "You're all set!",
      subtitle: 'Your meeting has been confirmed',
      bodyHtml: `
        <p style="color:#4b5563;font-size:15px;margin:0 0 20px">Hi <strong style="color:#1e1b4b">${data.inviteeName}</strong> 👋</p>
        <p style="color:#4b5563;font-size:14px;margin:0 0 20px">
          Your <strong style="color:#006BFF">${data.eventName}</strong> with <strong style="color:#1e1b4b">${data.hostName}</strong> is confirmed. We're looking forward to connecting with you!
        </p>
        ${detailsCard([
          ['📅', 'Date & Time', dateStr],
          ['⏱', 'Ends at', endStr],
          ['🌍', 'Timezone', tz.replace(/_/g, ' ')],
        ])}
        <p style="color:#6b7280;font-size:13px;margin:0;text-align:center">
          Need to make changes? Contact the host directly.
        </p>
      `,
    }),
  });
}

async function sendRescheduleEmail(to, data) {
  if (!env.SMTP_HOST) return;
  const tz = data.timezone || 'Asia/Kolkata';
  const newDateStr = formatInTz(data.newStartTime, tz);
  const newEndStr = formatTimeOnly(data.newEndTime, tz);
  const oldDateStr = formatInTz(data.oldStartTime, tz);

  await transporter.sendMail({
    from: env.SMTP_FROM, to,
    subject: `🔄 Rescheduled: ${data.eventName} with ${data.hostName}`,
    html: emailWrapper({
      icon: '🔄', iconBg: 'rgba(255,255,255,0.25)',
      title: 'Meeting Rescheduled',
      subtitle: 'Your meeting time has been updated',
      bodyHtml: `
        <p style="color:#4b5563;font-size:15px;margin:0 0 20px">Hi <strong style="color:#1e1b4b">${data.inviteeName}</strong>,</p>
        <p style="color:#4b5563;font-size:14px;margin:0 0 20px">
          Your <strong style="color:#006BFF">${data.eventName}</strong> with <strong style="color:#1e1b4b">${data.hostName}</strong> has been rescheduled to a new time.
        </p>

        <p style="color:#9999bb;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px">Previous time</p>
        <div style="background:#fff3f3;border-radius:10px;padding:12px 16px;margin-bottom:16px;border-left:3px solid #f87171">
          <span style="color:#ef4444;font-size:14px;text-decoration:line-through">${oldDateStr}</span>
        </div>

        <p style="color:#9999bb;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px">New time</p>
        ${detailsCard([
          ['📅', 'Date & Time', newDateStr],
          ['⏱', 'Ends at', newEndStr],
          ['🌍', 'Timezone', tz.replace(/_/g, ' ')],
        ])}
        <p style="color:#6b7280;font-size:13px;margin:0;text-align:center">
          Need to make further changes? Contact the host directly.
        </p>
      `,
    }),
  });
}

async function sendCancellationEmail(to, data) {
  if (!env.SMTP_HOST) return;
  const tz = data.timezone || 'Asia/Kolkata';
  const dateStr = formatInTz(data.startTime, tz);

  await transporter.sendMail({
    from: env.SMTP_FROM, to,
    subject: `❌ Cancelled: ${data.eventName}`,
    html: emailWrapper({
      icon: '✕', iconBg: 'rgba(255,255,255,0.2)',
      title: 'Meeting Cancelled',
      subtitle: 'Your meeting has been cancelled',
      bodyHtml: `
        <p style="color:#4b5563;font-size:15px;margin:0 0 20px">Hi <strong style="color:#1e1b4b">${data.inviteeName}</strong>,</p>
        <p style="color:#4b5563;font-size:14px;margin:0 0 20px">
          Your <strong style="color:#006BFF">${data.eventName}</strong> scheduled for the time below has been cancelled.
        </p>
        ${detailsCard([
          ['📅', 'Was scheduled for', dateStr],
          ['🌍', 'Timezone', tz.replace(/_/g, ' ')],
        ])}
        <p style="color:#6b7280;font-size:13px;margin:0;text-align:center">
          We hope to connect with you another time.
        </p>
      `,
    }),
  });
}

module.exports = { sendConfirmationEmail, sendRescheduleEmail, sendCancellationEmail };
