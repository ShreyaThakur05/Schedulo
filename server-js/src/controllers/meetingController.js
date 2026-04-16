const { addMinutes } = require('date-fns');
const prisma = require('../config/db');
const { sendConfirmationEmail, sendRescheduleEmail, sendCancellationEmail } = require('../services/emailService');

const listMeetings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const now = new Date();
    const where = { eventType: { userId: req.userId }, status: { not: 'CANCELLED' } };
    if (status === 'upcoming') { where.startTime = { gte: now }; where.status = 'CONFIRMED'; }
    else if (status === 'past') { where.endTime = { lt: now }; }
    const meetings = await prisma.meeting.findMany({
      where,
      include: { eventType: { select: { name: true, color: true, durationMinutes: true, eventKind: true } } },
      orderBy: { startTime: status === 'upcoming' ? 'asc' : 'desc' },
    });
    res.json({ data: meetings });
  } catch (e) { next(e); }
};

const getMeeting = async (req, res, next) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: req.params.id },
      include: { eventType: { include: { user: { select: { name: true, email: true } } } } },
    });
    if (!meeting) return res.status(404).json({ error: 'NOT_FOUND', message: 'Meeting not found.' });
    res.json({ data: meeting });
  } catch (e) { next(e); }
};

const createMeeting = async (req, res, next) => {
  try {
    const { eventTypeId, inviteeName, inviteeEmail, startTime } = req.body;
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId, isActive: true },
      include: { user: true },
    });
    if (!eventType) return res.status(404).json({ error: 'NOT_FOUND', message: 'Event type not found.' });
    const start = new Date(startTime);
    if (start <= new Date()) return res.status(400).json({ error: 'PAST_DATE', message: 'Cannot book a slot in the past.' });
    const end = addMinutes(start, eventType.durationMinutes);
    const meeting = await prisma.$transaction(async (tx) => {
      const conflict = await tx.meeting.findFirst({
        where: { eventTypeId, status: 'CONFIRMED', startTime: { lt: end }, endTime: { gt: start } },
      });
      if (conflict) { const err = new Error('This time slot is no longer available.'); err.status = 409; err.code = 'SLOT_UNAVAILABLE'; throw err; }
      return tx.meeting.create({
        data: { eventTypeId, inviteeName, inviteeEmail, startTime: start, endTime: end },
        include: { eventType: { include: { user: { select: { name: true } } } } },
      });
    });
    sendConfirmationEmail(inviteeEmail, { inviteeName, eventName: eventType.name, startTime: start.toISOString(), endTime: end.toISOString(), hostName: eventType.user.name, timezone: eventType.user.timezone || 'Asia/Kolkata' }).catch(console.error);
    res.status(201).json({ data: meeting });
  } catch (e) { next(e); }
};

const rescheduleMeeting = async (req, res, next) => {
  try {
    const { newStartTime } = req.body;
    const meeting = await prisma.meeting.findFirst({
      where: { id: req.params.id, eventType: { userId: req.userId }, status: 'CONFIRMED' },
      include: { eventType: { include: { user: true } } },
    });
    if (!meeting) return res.status(404).json({ error: 'NOT_FOUND', message: 'Meeting not found.' });
    const start = new Date(newStartTime);
    if (start <= new Date()) return res.status(400).json({ error: 'PAST_DATE', message: 'Cannot reschedule to a past time.' });
    const end = addMinutes(start, meeting.eventType.durationMinutes);
    const oldStartTime = meeting.startTime.toISOString();
    const updated = await prisma.$transaction(async (tx) => {
      const conflict = await tx.meeting.findFirst({
        where: { eventTypeId: meeting.eventTypeId, status: 'CONFIRMED', id: { not: meeting.id }, startTime: { lt: end }, endTime: { gt: start } },
      });
      if (conflict) { const err = new Error('This time slot is no longer available.'); err.status = 409; err.code = 'SLOT_UNAVAILABLE'; throw err; }
      return tx.meeting.update({
        where: { id: req.params.id },
        data: { startTime: start, endTime: end },
        include: { eventType: { select: { name: true, color: true, durationMinutes: true, eventKind: true } } },
      });
    });
    sendRescheduleEmail(meeting.inviteeEmail, {
      inviteeName: meeting.inviteeName,
      eventName: meeting.eventType.name,
      hostName: meeting.eventType.user.name,
      oldStartTime,
      newStartTime: start.toISOString(),
      newEndTime: end.toISOString(),
      timezone: meeting.eventType.user.timezone || 'Asia/Kolkata',
    }).catch(console.error);
    res.json({ data: updated });
  } catch (e) { next(e); }
};

const cancelMeeting = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const meeting = await prisma.meeting.findFirst({
      where: { id: req.params.id, eventType: { userId: req.userId } },
      include: { eventType: { include: { user: { select: { name: true, timezone: true } } } } },
    });
    if (!meeting) return res.status(404).json({ error: 'NOT_FOUND', message: 'Meeting not found.' });
    if (meeting.status === 'CANCELLED') return res.status(400).json({ error: 'ALREADY_CANCELLED', message: 'Meeting is already cancelled.' });
    const updated = await prisma.meeting.update({ where: { id: req.params.id }, data: { status: 'CANCELLED', cancellationReason } });
    sendCancellationEmail(meeting.inviteeEmail, { inviteeName: meeting.inviteeName, eventName: meeting.eventType.name, startTime: meeting.startTime.toISOString(), timezone: meeting.eventType.user?.timezone || 'Asia/Kolkata' }).catch(console.error);
    res.json({ data: updated });
  } catch (e) { next(e); }
};

module.exports = { listMeetings, getMeeting, createMeeting, rescheduleMeeting, cancelMeeting };
