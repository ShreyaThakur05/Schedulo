const prisma = require('../config/db');
const { subDays, format } = require('date-fns');

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.userId;
    const [total, confirmed, cancelled, byEventType, recentMeetings, eventTypesWithViews] = await Promise.all([
      prisma.meeting.count({ where: { eventType: { userId } } }),
      prisma.meeting.count({ where: { eventType: { userId }, status: 'CONFIRMED' } }),
      prisma.meeting.count({ where: { eventType: { userId }, status: 'CANCELLED' } }),
      prisma.meeting.groupBy({ by: ['eventTypeId'], where: { eventType: { userId }, status: 'CONFIRMED' }, _count: { id: true } }),
      prisma.meeting.findMany({ where: { eventType: { userId }, status: 'CONFIRMED', startTime: { gte: subDays(new Date(), 30) } }, select: { startTime: true }, orderBy: { startTime: 'asc' } }),
      prisma.eventType.findMany({ where: { userId, isActive: true }, select: { id: true, name: true, color: true, eventKind: true, pageViews: true } }),
    ]);

    const etMap = Object.fromEntries(eventTypesWithViews.map((e) => [e.id, e]));
    const byEventTypeEnriched = byEventType.map((r) => ({
      eventTypeId: r.eventTypeId,
      name: etMap[r.eventTypeId]?.name ?? 'Unknown',
      color: etMap[r.eventTypeId]?.color ?? '#6366f1',
      eventKind: etMap[r.eventTypeId]?.eventKind ?? 'ONE_ON_ONE',
      bookings: r._count.id,
      pageViews: etMap[r.eventTypeId]?.pageViews ?? 0,
      conversionRate: etMap[r.eventTypeId]?.pageViews ? Math.round((r._count.id / etMap[r.eventTypeId].pageViews) * 100) : 0,
    }));

    const totalPageViews = eventTypesWithViews.reduce((s, e) => s + e.pageViews, 0);
    const overallConversion = totalPageViews > 0 ? Math.round((confirmed / totalPageViews) * 100) : 0;

    const dailyMap = {};
    for (let i = 29; i >= 0; i--) dailyMap[format(subDays(new Date(), i), 'yyyy-MM-dd')] = 0;
    for (const m of recentMeetings) { const day = format(new Date(m.startTime), 'yyyy-MM-dd'); if (day in dailyMap) dailyMap[day]++; }
    const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));

    const byDow = Array.from({ length: 7 }, (_, i) => ({ day: i, count: 0 }));
    for (const m of recentMeetings) byDow[new Date(m.startTime).getDay()].count++;

    const byKind = {};
    for (const r of byEventType) { const kind = etMap[r.eventTypeId]?.eventKind ?? 'ONE_ON_ONE'; byKind[kind] = (byKind[kind] ?? 0) + r._count.id; }

    res.json({ data: { total, confirmed, cancelled, cancellationRate: total > 0 ? Math.round((cancelled / total) * 100) : 0, totalPageViews, overallConversion, byEventType: byEventTypeEnriched, daily, byDow, byKind } });
  } catch (e) { next(e); }
};

module.exports = { getAnalytics };
