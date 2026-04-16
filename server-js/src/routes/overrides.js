const { Router } = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { listOverrides, upsertOverride, deleteOverride } = require('../controllers/overrideController');
const router = Router();
router.get('/', listOverrides);
router.put('/', validate(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), startTime: z.string().optional(), endTime: z.string().optional(), isBlocked: z.boolean().default(false) })), upsertOverride);
router.delete('/:date', deleteOverride);
module.exports = router;
