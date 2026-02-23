const express = require('express');
const router = express.Router();
const adminMetricsController = require('../controllers/adminMetricsController');
const { authenticate, authorize, validate } = require('../middlewares');
const { conversionMetricsQuerySchema } = require('../validators/adminMetricsValidator');

router.get(
  '/metrics/conversion',
  authenticate,
  authorize('ADMIN'),
  validate(conversionMetricsQuerySchema),
  adminMetricsController.getConversionMetrics
);

module.exports = router;
