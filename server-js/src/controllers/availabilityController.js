const prisma = require('../config/db');
const { calculateSlots, getAvailableDates } = require('../services/slotCalculator');

const getAvailability = async (req, res, next) => {
  try {
    const rules = await prisma.availabilityRule.findMany({
      where: { userId: req.userId },
      orderBy: { dayOfWeek: 'asc' },
    });
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { timezone: true } });
    res.json({ data: { rules, timezone: user?.timezone || 'UTC' } });
  } catch (e) { next(e); }
};

const upsertAvailability = async (req, res, next) => {
  try {
    const { rules, timezone } = req.body;
    await prisma.$transaction([
      prisma.user.update({ where: { id: req.userId }, data: { timezone } }),
      ...rules.map((rule) =>
        prisma.availabilityRule.upsert({
          where: { userId_dayOfWeek: { userId: req.userId, dayOfWeek: rule.dayOfWeek } },
          update: { startTime: rule.startTime, endTime: rule.endTime, isActive: rule.isActive, timezone },
          create: { userId: req.userId, dayOfWeek: rule.dayOfWeek, startTime: rule.startTime, endTime: rule.endTime, isActive: rule.isActive, timezone },
        })
      ),
    ]);
    res.json({ data: { message: 'Availability updated.' } });
  } catch (e) { next(e); }
};

const getSlots = async (req, res, next) => {
  try {
    const { date, eventTypeId } = req.query;
    const slots = await calculateSlots(date, eventTypeId);
    res.json({ data: slots });
  } catch (e) { next(e); }
};

const getAvailableDatesForMonth = async (req, res, next) => {
  try {
    const { eventTypeId, year, month } = req.query;
    const dates = await getAvailableDates(eventTypeId, parseInt(year), parseInt(month));
    res.json({ data: dates });
  } catch (e) { next(e); }
};

module.exports = { getAvailability, upsertAvailability, getSlots, getAvailableDatesForMonth };
