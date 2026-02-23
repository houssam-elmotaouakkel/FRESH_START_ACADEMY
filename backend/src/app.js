const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const logger = require('./utils/logger');
const { successResponse } = require('./utils/apiResponse');

const routes = require('./routes/apiRouter');
const { errorHandler, notFound, apiLimiter } = require('./middlewares');

// Initialize Express
const app = express();

// Global middlewares
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
