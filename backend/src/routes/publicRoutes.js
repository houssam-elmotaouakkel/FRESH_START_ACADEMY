const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const { validate } = require('../middlewares');
const { trackEventSchema, trackEventsBatchSchema } = require('../validators/publicValidator');

router.get('/landing', publicController.getLandingContent);

router.post('/events', validate(trackEventSchema), publicController.trackEvent);

router.post('/events/batch', validate(trackEventsBatchSchema), publicController.trackEventsBatch);

module.exports = router;
