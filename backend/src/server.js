const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

app.listen(config.port, () => {
  logger.info(`Serveur démarré en mode ${config.env}`);
  logger.info(`URL: http://localhost:${config.port}`);
  logger.info(`Health: http://localhost:${config.port}/api/health`);
});

process.on('SIGINT', () => {
  logger.info(' Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info(' Shutting down gracefully...');
  process.exit(0);
});