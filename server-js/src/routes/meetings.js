const { Router } = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { listMeetings, getMeeting, createMeeting, cancelMeeting, rescheduleMeeting } = require('../controllers/meetingController');

const router = Router();

router.get('/', listMeetings);
router.get('/:id', getMeeting);
router.post('/', validate(z.object({ eventTypeId: z.string().uuid(), inviteeName: z.string().min(1).max(100), inviteeEmail: z.string().email(), startTime: z.string().datetime() })), createMeeting);
router.patch('/:id/cancel', validate(z.object({ cancellationReason: z.string().optional() })), cancelMeeting);
router.patch('/:id/reschedule', validate(z.object({ newStartTime: z.string().datetime() })), rescheduleMeeting);

module.exports = router;
