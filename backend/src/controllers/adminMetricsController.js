const conversionMetricsService = require('../services/conversionMetricsService');
const { successResponse } = require('../utils/apiResponse');

const getConversionMetrics = async (req, res, next) => {
  try {
    const metrics = await conversionMetricsService.getConversionMetrics(req.query);
    successResponse(res, metrics, 'Metriques de conversion recuperees');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversionMetrics,
};
