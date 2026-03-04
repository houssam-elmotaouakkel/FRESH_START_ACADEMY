const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./config');
const logger = require('./utils/logger');
const { successResponse } = require('./utils/apiResponse');
const { sanitizeMiddleware } = require('./utils/sanitize');
const { initRedis } = require('./services/cacheService');

const routes = require('./routes/apiRouter');
const { errorHandler, notFound, apiLimiter } = require('./middlewares');

// Initialize Express
const app = express();

// Initialize Redis cache (non-blocking — degrades gracefully)
initRedis();

// Trust proxy (for rate limiter behind reverse proxy / Docker)
app.set('trust proxy', 1);

// Global middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://*.googleapis.com'],
        connectSrc: ["'self'", config.cors.origin],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(compression());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// XSS sanitization on all incoming data
app.use(sanitizeMiddleware);

if (config.env === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// Main API routes protected by global rate limiter
app.use('/api', apiLimiter, routes);

// Root route
app.get('/', (req, res) => {
  successResponse(
    res,
    {
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        users: '/api/users',
        courses: '/api/courses',
      },
    },
    "Bienvenue sur l'API Fresh Start Academy"
  );
});

// 404 + global error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
