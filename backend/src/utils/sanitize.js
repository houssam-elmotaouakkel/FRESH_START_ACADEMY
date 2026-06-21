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
 * Map of characters to their HTML entity equivalents (canonical OWASP set).
 * '&' must be replaced first, which is guaranteed by the single-pass regex.
 */
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Contextually encode a string as HTML entities for safe inclusion in an
 * HTML output context (e.g. an outbound email body).
 *
 * This is distinct from sanitizeString(): the global XSS filter is tuned for
 * a browser/DOM context, whereas outbound emails are a different interpreter.
 * Per the secure-coding checklist (2.3 / 2.4) each output context must use its
 * own encoding routine rather than relying on a single upstream filter, and
 * all hazardous characters must be encoded unless known to be safe.
 *
 * @param {string} str - Input string
 * @returns {string} - HTML-entity-encoded string ('' for non-strings)
 */
const escapeHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char]);
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
  if (req.query) {
    const sanitizedQuery = sanitizeObject(req.query);
    for (const key of Object.keys(req.query)) delete req.query[key];
    Object.assign(req.query, sanitizedQuery);
  }
  if (req.params) {
    const sanitizedParams = sanitizeObject(req.params);
    for (const key of Object.keys(req.params)) delete req.params[key];
    Object.assign(req.params, sanitizedParams);
  }
  next();
};

module.exports = {
  sanitizeString,
  escapeHtml,
  sanitizeObject,
  sanitizeMiddleware,
};
