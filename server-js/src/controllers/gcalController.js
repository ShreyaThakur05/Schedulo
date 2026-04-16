const { google } = require('googleapis');
const prisma = require('../config/db');
const { env } = require('../config/env');

function getOAuthClient() {
  return new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, env.GOOGLE_REDIRECT_URI);
}

const getAuthUrl = (req, res) => {
  if (!env.GOOGLE_CLIENT_ID) return res.status(503).json({ error: 'GCAL_NOT_CONFIGURED', message: 'Google Calendar is not configured.' });
  const oauth2 = getOAuthClient();
  const url = oauth2.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/userinfo.email'] });
  res.json({ data: { url } });
};

const handleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    const oauth2 = getOAuthClient();
    const { tokens } = await oauth2.getToken(code);
    oauth2.setCredentials(tokens);
    const oauth2Api = google.oauth2({ version: 'v2', auth: oauth2 });
    const { data: userInfo } = await oauth2Api.userinfo.get();
    await prisma.user.update({
      where: { id: req.userId },
      data: { googleCalendarToken: tokens.access_token, googleCalendarRefresh: tokens.refresh_token ?? undefined, googleCalendarEmail: userInfo.email ?? undefined },
    });
    res.redirect(`${env.FRONTEND_URL}/settings?gcal=connected`);
  } catch (e) { next(e); }
};

const getStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { googleCalendarToken: true, googleCalendarEmail: true } });
    res.json({ data: { connected: !!user?.googleCalendarToken, email: user?.googleCalendarEmail ?? null } });
  } catch (e) { next(e); }
};

const disconnect = async (req, res, next) => {
  try {
    await prisma.user.update({ where: { id: req.userId }, data: { googleCalendarToken: null, googleCalendarRefresh: null, googleCalendarEmail: null } });
    res.json({ data: { message: 'Disconnected.' } });
  } catch (e) { next(e); }
};

async function getGoogleBusySlots(userId, date) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { googleCalendarToken: true, googleCalendarRefresh: true } });
  if (!user?.googleCalendarToken) return [];
  try {
    const oauth2 = getOAuthClient();
    oauth2.setCredentials({ access_token: user.googleCalendarToken, refresh_token: user.googleCalendarRefresh ?? undefined });
    const calendar = google.calendar({ version: 'v3', auth: oauth2 });
    const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
    const timeMax = new Date(`${date}T23:59:59Z`).toISOString();
    const { data } = await calendar.freebusy.query({ requestBody: { timeMin, timeMax, items: [{ id: 'primary' }] } });
    const busy = data.calendars?.primary?.busy ?? [];
    return busy.map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
  } catch { return []; }
}

module.exports = { getAuthUrl, handleCallback, getStatus, disconnect, getGoogleBusySlots };
