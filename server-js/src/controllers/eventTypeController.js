const prisma = require('../config/db');

const listEventTypes = async (req, res, next) => {
  try {
    const eventTypes = await prisma.eventType.findMany({
      where: { userId: req.userId, isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ data: eventTypes });
  } catch (e) { next(e); }
};

const getEventType = async (req, res, next) => {
  try {
    const et = await prisma.eventType.findFirst({
      where: { id: req.params.id, userId: req.userId, isActive: true },
    });
    if (!et) return res.status(404).json({ error: 'NOT_FOUND', message: 'Event type not found.' });
    res.json({ data: et });
  } catch (e) { next(e); }
};

const getEventTypeBySlug = async (req, res, next) => {
  try {
    const et = await prisma.eventType.findFirst({
      where: { slug: req.params.slug, isActive: true },
      include: { user: { select: { name: true, email: true, timezone: true } } },
    });
    if (!et) return res.status(404).json({ error: 'NOT_FOUND', message: 'Event type not found.' });
    prisma.eventType.update({ where: { id: et.id }, data: { pageViews: { increment: 1 } } }).catch(() => {});
    res.json({ data: et });
  } catch (e) { next(e); }
};

const createEventType = async (req, res, next) => {
  try {
    const { name, slug, durationMinutes, bufferMinutes, maxPerDay, eventKind, description, color } = req.body;
    const existing = await prisma.eventType.findUnique({ where: { slug } });
    if (existing) return res.status(409).json({ error: 'SLUG_CONFLICT', message: `Slug "${slug}" is already taken.` });
    const et = await prisma.eventType.create({
      data: { userId: req.userId, name, slug, durationMinutes, bufferMinutes: bufferMinutes ?? 0, maxPerDay: maxPerDay ?? null, eventKind: eventKind ?? 'ONE_ON_ONE', description, color },
    });
    res.status(201).json({ data: et });
  } catch (e) { next(e); }
};

const updateEventType = async (req, res, next) => {
  try {
    const { name, durationMinutes, bufferMinutes, maxPerDay, eventKind, description, color } = req.body;
    const et = await prisma.eventType.updateMany({
      where: { id: req.params.id, userId: req.userId },
      data: { name, durationMinutes, bufferMinutes, maxPerDay, eventKind, description, color },
    });
    if (et.count === 0) return res.status(404).json({ error: 'NOT_FOUND', message: 'Event type not found.' });
    const updated = await prisma.eventType.findUnique({ where: { id: req.params.id } });
    res.json({ data: updated });
  } catch (e) { next(e); }
};

const deleteEventType = async (req, res, next) => {
  try {
    const et = await prisma.eventType.updateMany({
      where: { id: req.params.id, userId: req.userId },
      data: { isActive: false },
    });
    if (et.count === 0) return res.status(404).json({ error: 'NOT_FOUND', message: 'Event type not found.' });
    res.status(204).send();
  } catch (e) { next(e); }
};

module.exports = { listEventTypes, getEventType, getEventTypeBySlug, createEventType, updateEventType, deleteEventType };
