const express = require('express');
const router = express.Router();
const { getDbClient } = require('../config/database');
const { isConnected: isRedisConnected } = require('../services/cacheService');

// Import des routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const contactRoutes = require('./contactRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const adminRoutes = require('./adminRoutes');
const publicRoutes = require('./publicRoutes');
const passwordResetRoutes = require('./passwordResetRoutes');
const totpRoutes = require('./totpRoutes');
const notificationRoutes = require('./notificationRoutes');
const paymentRoutes = require('./paymentRoutes');



// Monter les routes
router.use('/auth', authRoutes);
router.use('/auth', passwordResetRoutes);
router.use('/auth/2fa', totpRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/contacts', contactRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/admin', adminRoutes);
router.use('/public', publicRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payments', paymentRoutes);



// Deep health check — verifies DB + Redis connectivity
router.get('/health', async (req, res) => {
  try {
    const prisma = getDbClient();
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      db: 'connected',
      redis: isRedisConnected() ? 'connected' : 'disconnected',
    });
  } catch {
    res.status(503).json({
      success: false,
      message: 'API is unhealthy',
      timestamp: new Date().toISOString(),
      db: 'disconnected',
      redis: isRedisConnected() ? 'connected' : 'disconnected',
    });
  }
});

module.exports = router;
