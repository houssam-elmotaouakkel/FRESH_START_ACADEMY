const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

// Singleton pattern - une seule instance de Prisma
let prisma = null;

const getDbClient = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log des requêtes en mode développement
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query', (e) => {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    // Log des erreurs
    prisma.$on('error', (e) => {
      logger.error('Prisma Error:', e);
    });
  }

  return prisma;
};

// Connexion à la base de données
const connectDatabase = async () => {
  try {
    const client = getDbClient();
    await client.$connect();
    logger.info('✅ Database connected successfully');
    return client;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Déconnexion propre
const disconnectDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
};

module.exports = {
  getDbClient,
  connectDatabase,
  disconnectDatabase,
};
