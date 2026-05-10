const logger = require('../utils/logger');

/**
 * Middleware that logs request duration and status code.
 * Attaches a high-resolution timer and logs on response finish.
 */
const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const status = res.statusCode;
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

    logger[level](
      `${req.method} ${req.originalUrl} ${status} ${durationMs.toFixed(1)}ms`
    );
  });

  next();
};

module.exports = { requestLogger };
