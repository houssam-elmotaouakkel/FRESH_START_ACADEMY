const app = require('./app');
const config = require('./config');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const logger = require('./utils/logger');
const { startTokenCleanup, stopTokenCleanup } = require('./cron/tokenCleanup');

const startServer = async () => {
  try {
    // Connexion à la base de données
    await connectDatabase();

    // Start periodic token cleanup
    startTokenCleanup();

    // Démarrer le serveur
    app.listen(config.port, () => {
      logger.info(`✅ Serveur démarré en mode ${config.env}`);
      logger.info(`📍 URL: http://localhost:${config.port}`);
      logger.info(`❤️  Health: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Démarrer
startServer();

// GESTION DE L'ARRÊT PROPRE

process.on('SIGINT', async () => {
  logger.info('\n👋 Shutting down gracefully...');
  stopTokenCleanup();
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('\n👋 Shutting down gracefully...');
  stopTokenCleanup();
  await disconnectDatabase();
  process.exit(0);
});
