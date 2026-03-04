const { ApiError, notFound, errorHandler } = require('./errorHandler');
const { authenticate, authorize, optionalAuth } = require('./auth');
const { validate } = require('./validate');
const { apiLimiter, authLimiter, contactLimiter } = require('./rateLimiter');
const { PERMISSIONS, requirePermission, hasPermission } = require('./rbac');
const { auditMiddleware } = require('../services/auditService');

module.exports = {
  // Error handling
  ApiError,
  notFound,
  errorHandler,
  
  // Authentication
  authenticate,
  authorize,
  optionalAuth,
  
  // RBAC
  PERMISSIONS,
  requirePermission,
  hasPermission,
  
  // Audit
  auditMiddleware,
  
  // Validation
  validate,
  
  // Rate limiting
  apiLimiter,
  authLimiter,
  contactLimiter,
};
