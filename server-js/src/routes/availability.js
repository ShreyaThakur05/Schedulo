const { Router } = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { getAvailability, upsertAvailability, getSlots, getAvailableDatesForMonth } = require('../controllers/availabilityController');

const router = Router();

const upsertSchema = z.object({
  timezone: z.string().min(1),
  rules: z.array(z.object({ dayOfWeek: z.number().int().min(0).max(6), startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/), endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/), isActive: z.boolean() })),
});

router.get('/', getAvailability);
router.put('/', validate(upsertSchema), upsertAvailability);
router.get('/slots', validate(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), eventTypeId: z.string().uuid() }), 'query'), getSlots);
router.get('/dates', validate(z.object({ eventTypeId: z.string().uuid(), year: z.string().regex(/^\d{4}$/), month: z.string().regex(/^\d{1,2}$/) }), 'query'), getAvailableDatesForMonth);

module.exports = router;
