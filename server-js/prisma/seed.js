require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { addDays, addMinutes, nextMonday, setHours, setMinutes } = require('date-fns');

const prisma = new PrismaClient();
const SEED_USER_ID = process.env.SEED_USER_ID || '00000000-0000-0000-0000-000000000001';

async function main() {
  console.log('Seeding database...');

  await prisma.user.upsert({
    where: { email: 'arjun@schedulo.dev' },
    update: {},
    create: { id: SEED_USER_ID, name: 'Arjun Mehta', email: 'arjun@schedulo.dev', timezone: 'Asia/Kolkata' },
  });

  const et30 = await prisma.eventType.upsert({ where: { slug: '30-min-chat' }, update: {}, create: { userId: SEED_USER_ID, name: '30 Min Chat', slug: '30-min-chat', durationMinutes: 30, description: 'A quick 30-minute introductory call.', color: '#6366f1', eventKind: 'ONE_ON_ONE' } });
  const et60 = await prisma.eventType.upsert({ where: { slug: '60-min-deep-dive' }, update: {}, create: { userId: SEED_USER_ID, name: '60 Min Deep Dive', slug: '60-min-deep-dive', durationMinutes: 60, description: 'An in-depth technical discussion.', color: '#7c3aed', eventKind: 'ONE_ON_ONE' } });
  const et15 = await prisma.eventType.upsert({ where: { slug: '15-min-intro' }, update: {}, create: { userId: SEED_USER_ID, name: '15 Min Intro', slug: '15-min-intro', durationMinutes: 15, description: 'A brief introductory call.', color: '#059669', eventKind: 'ONE_ON_ONE' } });

  const timezone = 'America/New_York';
  for (let day = 1; day <= 5; day++) {
    await prisma.availabilityRule.upsert({
      where: { userId_dayOfWeek: { userId: SEED_USER_ID, dayOfWeek: day } },
      update: {},
      create: { userId: SEED_USER_ID, dayOfWeek: day, startTime: '09:00:00', endTime: '17:00:00', timezone, isActive: true },
    });
  }

  const existingMeetings = await prisma.meeting.count();
  if (existingMeetings === 0) {
    const monday = nextMonday(new Date());
    const meetingData = [
      { name: 'Priya Sharma',    email: 'priya@techcorp.in',    dayOffset: 0,  hour: 10, et: et30 },
      { name: 'Rahul Verma',     email: 'rahul@startup.io',     dayOffset: 1,  hour: 14, et: et60 },
      { name: 'Ananya Iyer',     email: 'ananya@design.co',     dayOffset: 2,  hour: 11, et: et15 },
      { name: 'Vikram Nair',     email: 'vikram@agency.in',     dayOffset: 3,  hour: 15, et: et30 },
      { name: 'Sneha Patel',     email: 'sneha@corp.in',        dayOffset: -7, hour: 10, et: et30 },
    ];
    for (const m of meetingData) {
      const start = setMinutes(setHours(addDays(monday, m.dayOffset), m.hour), 0);
      const end = addMinutes(start, m.et.durationMinutes);
      await prisma.meeting.create({ data: { eventTypeId: m.et.id, inviteeName: m.name, inviteeEmail: m.email, startTime: start, endTime: end, status: 'CONFIRMED' } });
    }
  }
  console.log('Seed complete.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
