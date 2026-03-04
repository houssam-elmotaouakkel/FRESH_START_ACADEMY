const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares');
const { successResponse } = require('../utils/apiResponse');
const notificationService = require('../services/notificationService');

/**
 * @route   GET /api/notifications/stream
 * @desc    SSE endpoint for real-time notifications
 * @access  Private
 */
router.get('/stream', authenticate, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable nginx buffering
  });

  // Send initial heartbeat
  res.write('event: connected\ndata: {"status":"connected"}\n\n');

  // Register client
  notificationService.addClient(req.user.id, res);

  // Keep-alive every 30s
  const keepAlive = setInterval(() => {
    res.write(':keep-alive\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
  });
});

/**
 * @route   GET /api/notifications
 * @desc    Get notification history
 * @access  Private
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await notificationService.getUserNotifications(req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    successResponse(res, result, 'Notifications récupérées');
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/notifications/read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read', authenticate, async (req, res, next) => {
  try {
    await notificationService.markAsRead(req.user.id);
    successResponse(res, null, 'Notifications marquées comme lues');
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark single notification as read
 * @access  Private
 */
router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    await notificationService.markAsRead(req.user.id, req.params.id);
    successResponse(res, null, 'Notification marquée comme lue');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
