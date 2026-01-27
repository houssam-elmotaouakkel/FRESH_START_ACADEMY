const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const { getDbClient } = require('./config/database');
const logger = require('./utils/logger');
const { successResponse, errorResponse } = require('./utils/apiResponse');


const routes = require('./routes/apiRouter');
const { errorHandler, notFound } = require('./middlewares');

// Initialiser Express et Prisma
const app = express();
const prisma = getDbClient();

// MIDDLEWARES
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes API
app.use('/api', routes);

// Log des requêtes en développement
if (config.env === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ROUTES DE TEST (temporaires)

// Route principale
app.get('/', (req, res) => {
  successResponse(res, {
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      courses: '/api/courses'
    }
  }, '🎓 Bienvenue sur l\'API Fresh Start Academy!');
});

// Route de santé (health check)
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    successResponse(res, {
      database: 'Connected ✅',
      environment: config.env,
      timestamp: new Date().toISOString()
    }, 'API is running!');
  } catch (error) {
    logger.error('Database health check failed:', error);
    errorResponse(res, 'Database connection failed', 500);
  }
});

// Route pour tester les utilisateurs
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });
    
    successResponse(res, users, `${users.length} utilisateur(s) trouvé(s)`);
  } catch (error) {
    logger.error('Error fetching users:', error);
    errorResponse(res, 'Erreur lors de la récupération des utilisateurs', 500);
  }
});

// Route pour tester les cours
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        level: true,
        price: true,
        isActive: true
      }
    });
    
    successResponse(res, courses, `${courses.length} cours trouvé(s)`);
  } catch (error) {
    logger.error('Error fetching courses:', error);
    errorResponse(res, 'Erreur lors de la récupération des cours', 500);
  }
});


// Middleware 404
app.use(notFound);


// Route 404 (Express 5 syntax)
app.use((req, res) => {
  errorResponse(res, `Route ${req.originalUrl} non trouvée`, 404);
});


// Middleware de gestion des erreurs
app.use(errorHandler);

// Exporter app
module.exports = app;
