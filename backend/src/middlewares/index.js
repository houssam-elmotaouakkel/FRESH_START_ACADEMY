const { ApiError, notFound, errorHandler } = require('./errorHandler');
const { authenticate, authorize, optionalAuth } = require('./auth');
const { validate } = require('./validate');
const { apiLimiter, authLimiter, contactLimiter } = require('./rateLimiter');

module.exports = {
  // Error handling
  ApiError,
  notFound,
  errorHandler,
  
  // Authentication
  authenticate,
  authorize,
  optionalAuth,
  
  // Validation
  validate,
  
  // Rate limiting
  apiLimiter,
  authLimiter,
  contactLimiter,
};
