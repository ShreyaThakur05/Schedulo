const { Router } = require('express');
const { getAuthUrl, handleCallback, getStatus, disconnect } = require('../controllers/gcalController');
const router = Router();
router.get('/auth-url', getAuthUrl);
router.get('/callback', handleCallback);
router.get('/status', getStatus);
router.delete('/disconnect', disconnect);
module.exports = router;
