const { addMinutes, isAfter, isBefore, format, startOfDay, endOfDay } = require('date-fns');
const { fromZonedTime } = require('date-fns-tz');
const prisma = require('../config/db');
const { getGoogleBusySlots } = require('../controllers/gcalController');

async function calculateSlots(date, eventTypeId) {
  const eventType = await prisma.eventType.findUnique({ where: { id: eventTypeId, isActive: true }, include: { user: true } });
  if (!eventType) return [];

  const userId = eventType.userId;
  const dayOfWeek = new Date(`${date}T12:00:00`).getDay();

  const override = await prisma.availabilityOverride.findUnique({ where: { userId_date: { userId, date } } });

  let startUTC, endUTC;
  if (override) {
    if (override.isBlocked) return [];
    if (override.startTime && override.endTime) {
      const tz = (await prisma.availabilityRule.findFirst({ where: { userId } }))?.timezone || 'UTC';
      startUTC = fromZonedTime(`${date}T${override.startTime}`, tz);
      endUTC = fromZonedTime(`${date}T${override.endTime}`, tz);
    } else return [];
  } else {
    const rule = await prisma.availabilityRule.findUnique({ where: { userId_dayOfWeek: { userId, dayOfWeek } } });
    if (!rule || !rule.isActive) return [];
    startUTC = fromZonedTime(`${date}T${rule.startTime}`, rule.timezone);
    endUTC = fromZonedTime(`${date}T${rule.endTime}`, rule.timezone);
  }

  const now = new Date();
  const duration = eventType.durationMinutes;
  const buffer = eventType.bufferMinutes ?? 0;

  const slots = [];
  let cursor = startUTC;
  while (true) {
    const slotEnd = addMinutes(cursor, duration);
    if (slotEnd > endUTC) break;
    if (isAfter(cursor, now)) slots.push({ startTime: cursor.toISOString(), endTime: slotEnd.toISOString() });
    cursor = addMinutes(cursor, 15);
  }
  if (slots.length === 0) return [];

  const bookedMeetings = await prisma.meeting.findMany({ where: { eventTypeId, status: 'CONFIRMED', startTime: { lt: endUTC }, endTime: { gt: startUTC } } });

  if (eventType.maxPerDay) {
    const todayCount = await prisma.meeting.count({ where: { eventType: { userId }, status: 'CONFIRMED', startTime: { gte: startOfDay(new Date(`${date}T12:00:00`)), lte: endOfDay(new Date(`${date}T12:00:00`)) } } });
    if (todayCount >= eventType.maxPerDay) return [];
  }

  const gcalBusy = await getGoogleBusySlots(userId, date);

  return slots.filter((slot) => {
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);
    const blockedByBooking = bookedMeetings.some((m) => isBefore(slotStart, addMinutes(m.endTime, buffer)) && isAfter(slotEnd, addMinutes(m.startTime, -buffer)));
    const blockedByGcal = gcalBusy.some((b) => isBefore(slotStart, b.end) && isAfter(slotEnd, b.start));
    return !blockedByBooking && !blockedByGcal;
  });
}

async function getAvailableDates(eventTypeId, year, month) {
  const eventType = await prisma.eventType.findUnique({ where: { id: eventTypeId, isActive: true } });
  if (!eventType) return [];
  const rules = await prisma.availabilityRule.findMany({ where: { userId: eventType.userId, isActive: true } });
  const activeDays = new Set(rules.map((r) => r.dayOfWeek));
  const overrides = await prisma.availabilityOverride.findMany({ where: { userId: eventType.userId } });
  const overrideMap = Object.fromEntries(overrides.map((o) => [o.date, o]));
  const dates = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month - 1, day, 12, 0, 0);
    const dateStr = format(d, 'yyyy-MM-dd');
    if (dateStr < todayStr) continue;
    const override = overrideMap[dateStr];
    if (override) { if (!override.isBlocked && override.startTime && override.endTime) dates.push(dateStr); }
    else if (activeDays.has(d.getDay())) dates.push(dateStr);
  }
  return dates;
}

module.exports = { calculateSlots, getAvailableDates };
