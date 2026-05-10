const express = require('express');
const router = express.Router();

const contactRoutes = require('./contactRoutes');

router.use('/contacts', contactRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

module.exports = router;
