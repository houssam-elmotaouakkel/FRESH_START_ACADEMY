const express = require('express');
const router = express.Router();
const adminMetricsController = require('../controllers/adminMetricsController');
const { authenticate, validate, PERMISSIONS, requirePermission } = require('../middlewares');
const { conversionMetricsQuerySchema } = require('../validators/adminMetricsValidator');
const { getAuditLogs } = require('../services/auditService');
const { successResponse } = require('../utils/apiResponse');

router.get(
  '/metrics/conversion',
  authenticate,
  requirePermission(PERMISSIONS.METRICS_VIEW),
  validate(conversionMetricsQuerySchema),
  adminMetricsController.getConversionMetrics
);

// Audit logs endpoint
router.get(
  '/audit-logs',
  authenticate,
  requirePermission(PERMISSIONS.METRICS_VIEW),
  async (req, res, next) => {
    try {
      const { page, limit, userId, action, resource } = req.query;
      const result = await getAuditLogs({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 50,
        userId,
        action,
        resource,
      });
      successResponse(res, result, 'Audit logs récupérés');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
