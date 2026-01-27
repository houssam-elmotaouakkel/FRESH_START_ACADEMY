const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const contactRoutes = require('./contactRoutes');
const testimonialRoutes = require('./testimonialRoutes');



// Monter les routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/contacts', contactRoutes);
router.use('/testimonials', testimonialRoutes);



// Route de santé pour /api
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
