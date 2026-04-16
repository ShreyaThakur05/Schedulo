const { Router } = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { listEventTypes, getEventType, getEventTypeBySlug, createEventType, updateEventType, deleteEventType } = require('../controllers/eventTypeController');

const router = Router();

const createSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  durationMinutes: z.number().int().positive(),
  bufferMinutes: z.number().int().min(0).optional(),
  maxPerDay: z.number().int().positive().nullable().optional(),
  eventKind: z.enum(['ONE_ON_ONE','GROUP','WEBINAR','INTERVIEW']).optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

const updateSchema = createSchema.omit({ slug: true }).partial();

router.get('/', listEventTypes);
router.get('/slug/:slug', getEventTypeBySlug);
router.get('/:id', getEventType);
router.post('/', validate(createSchema), createEventType);
router.put('/:id', validate(updateSchema), updateEventType);
router.delete('/:id', deleteEventType);

module.exports = router;
