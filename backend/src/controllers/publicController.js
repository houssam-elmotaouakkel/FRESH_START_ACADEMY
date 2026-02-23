const landingService = require('../services/landingService');
const conversionEventService = require('../services/conversionEventService');
const { successResponse, createdResponse } = require('../utils/apiResponse');

const getLandingContent = async (req, res, next) => {
  try {
    const data = await landingService.getLandingContent();
    successResponse(res, data, 'Contenu landing recupere');
  } catch (error) {
    next(error);
  }
};

const trackEvent = async (req, res, next) => {
  try {
    const event = await conversionEventService.trackEvent(req.body, {
      ip: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });
    createdResponse(res, event, 'Evenement enregistre');
  } catch (error) {
    next(error);
  }
};

const trackEventsBatch = async (req, res, next) => {
  try {
    const count = await conversionEventService.trackEventsBatch(req.body.events, {
      ip: req.ip,
      userAgent: req.headers['user-agent'] || null,
    });

    successResponse(res, { count }, `${count} evenement(s) enregistre(s)`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLandingContent,
  trackEvent,
  trackEventsBatch,
};
