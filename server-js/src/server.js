const app = require('./app');
const { env } = require('./config/env');
const prisma = require('./config/db');
const { addDays, addMinutes, nextMonday, setHours, setMinutes } = require('date-fns');

const SEED_USER_ID = env.SEED_USER_ID;

async function autoSeed() {
  try {
    const existing = await prisma.user.findUnique({ where: { id: SEED_USER_ID } });
    if (existing) return; // already seeded

    console.log('Running auto-seed...');

    await prisma.user.create({
      data: { id: SEED_USER_ID, name: 'Shreya Thakur', email: 'shreya@schedulo.dev', timezone: 'Asia/Kolkata' },
    });

    const et30 = await prisma.eventType.create({ data: { userId: SEED_USER_ID, name: '30 Min Chat', slug: '30-min-chat', durationMinutes: 30, description: 'A quick 30-minute introductory call.', color: '#6366f1', eventKind: 'ONE_ON_ONE' } });
    const et60 = await prisma.eventType.create({ data: { userId: SEED_USER_ID, name: '60 Min Deep Dive', slug: '60-min-deep-dive', durationMinutes: 60, description: 'An in-depth technical discussion.', color: '#7c3aed', eventKind: 'ONE_ON_ONE' } });
    const et15 = await prisma.eventType.create({ data: { userId: SEED_USER_ID, name: '15 Min Intro', slug: '15-min-intro', durationMinutes: 15, description: 'A brief introductory call.', color: '#059669', eventKind: 'ONE_ON_ONE' } });

    for (let day = 1; day <= 5; day++) {
      await prisma.availabilityRule.create({
        data: { userId: SEED_USER_ID, dayOfWeek: day, startTime: '09:00:00', endTime: '17:00:00', timezone: 'Asia/Kolkata', isActive: true },
      });
    }

    const monday = nextMonday(new Date());
    const meetings = [
      { name: 'Priya Sharma',  email: 'priya@techcorp.in',  dayOffset: 0,  hour: 10, et: et30 },
      { name: 'Rahul Verma',   email: 'rahul@startup.io',   dayOffset: 1,  hour: 14, et: et60 },
      { name: 'Ananya Iyer',   email: 'ananya@design.co',   dayOffset: 2,  hour: 11, et: et15 },
      { name: 'Vikram Nair',   email: 'vikram@agency.in',   dayOffset: 3,  hour: 15, et: et30 },
      { name: 'Sneha Patel',   email: 'sneha@corp.in',      dayOffset: -7, hour: 10, et: et30 },
    ];
    for (const m of meetings) {
      const start = setMinutes(setHours(addDays(monday, m.dayOffset), m.hour), 0);
      const end = addMinutes(start, m.et.durationMinutes);
      await prisma.meeting.create({ data: { eventTypeId: m.et.id, inviteeName: m.name, inviteeEmail: m.email, startTime: start, endTime: end, status: 'CONFIRMED' } });
    }

    console.log('Auto-seed complete.');
  } catch (e) {
    console.error('Auto-seed error:', e.message);
  }
}

app.listen(env.PORT, async () => {
  console.log(`Schedulo API running on http://localhost:${env.PORT}`);
  await autoSeed();
});
