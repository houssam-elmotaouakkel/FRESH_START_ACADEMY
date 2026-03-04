const xss = require('xss');

/**
 * Sanitize a single string against XSS
 * @param {string} str - Input string
 * @returns {string} - Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return xss(str);
};

/**
 * Deep-sanitize all string values in an object
 * @param {object} obj - Input object
 * @returns {object} - Sanitized copy
 */
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj !== 'object') return obj;

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

/**
 * Express middleware that sanitizes req.body, req.query, and req.params
 */
const sanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  sanitizeMiddleware,
};
