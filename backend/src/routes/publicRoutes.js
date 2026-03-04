const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const { validate } = require('../middlewares');
const { trackEventSchema, trackEventsBatchSchema } = require('../validators/publicValidator');
const { cacheMiddleware } = require('../services/cacheService');

// Landing page — cached for 10 minutes (content changes rarely)
router.get('/landing', cacheMiddleware('public:landing', 600), publicController.getLandingContent);

router.post('/events', validate(trackEventSchema), publicController.trackEvent);

router.post('/events/batch', validate(trackEventsBatchSchema), publicController.trackEventsBatch);

module.exports = router;
