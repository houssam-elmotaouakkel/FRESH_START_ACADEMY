const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./config');
const { successResponse } = require('./utils/apiResponse');
const { sanitizeMiddleware } = require('./utils/sanitize');
const { requestLogger } = require('./middlewares/requestLogger');
const routes = require('./routes/apiRouter');
const { errorHandler, notFound, apiLimiter } = require('./middlewares');

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
      connectSrc: ["'self'", config.cors.origin],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeMiddleware);
app.use(requestLogger);

app.use('/api', apiLimiter, routes);

app.get('/', (req, res) => {
  successResponse(res, {
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contacts: '/api/contacts',
    },
  }, "Bienvenue sur l'API Fresh Start Academy");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
