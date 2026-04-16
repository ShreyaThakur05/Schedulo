const { Router } = require('express');
const { defaultUser } = require('../middleware/defaultUser');
const eventTypesRouter = require('./eventTypes');
const availabilityRouter = require('./availability');
const meetingsRouter = require('./meetings');
const analyticsRouter = require('./analytics');
const gcalRouter = require('./gcal');
const overridesRouter = require('./overrides');

const router = Router();
router.use(defaultUser);
router.use('/event-types', eventTypesRouter);
router.use('/availability', availabilityRouter);
router.use('/availability/overrides', overridesRouter);
router.use('/meetings', meetingsRouter);
router.use('/analytics', analyticsRouter);
router.use('/gcal', gcalRouter);

module.exports = router;
