const prisma = require('../config/db');

const listOverrides = async (req, res, next) => {
  try {
    const overrides = await prisma.availabilityOverride.findMany({ where: { userId: req.userId }, orderBy: { date: 'asc' } });
    res.json({ data: overrides });
  } catch (e) { next(e); }
};

const upsertOverride = async (req, res, next) => {
  try {
    const { date, startTime, endTime, isBlocked } = req.body;
    const override = await prisma.availabilityOverride.upsert({
      where: { userId_date: { userId: req.userId, date } },
      update: { startTime, endTime, isBlocked },
      create: { userId: req.userId, date, startTime, endTime, isBlocked },
    });
    res.json({ data: override });
  } catch (e) { next(e); }
};

const deleteOverride = async (req, res, next) => {
  try {
    await prisma.availabilityOverride.deleteMany({ where: { userId: req.userId, date: req.params.date } });
    res.status(204).send();
  } catch (e) { next(e); }
};

module.exports = { listOverrides, upsertOverride, deleteOverride };
