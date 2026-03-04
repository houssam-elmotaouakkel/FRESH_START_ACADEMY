const { getDbClient } = require('../config/database');
const logger = require('../utils/logger');

const prisma = getDbClient();

// SSE client connections: Map<userId, Set<res>>
const clients = new Map();

/**
 * Register an SSE client
 */
const addClient = (userId, res) => {
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(res);

  // Cleanup on disconnect
  res.on('close', () => {
    clients.get(userId)?.delete(res);
    if (clients.get(userId)?.size === 0) {
      clients.delete(userId);
    }
  });
};

/**
 * Send event to a specific user's SSE connections
 */
const sendToUser = (userId, event, data) => {
  const userClients = clients.get(userId);
  if (!userClients) return;

  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  userClients.forEach((res) => {
    try {
      res.write(message);
    } catch {
      // Client disconnected
    }
  });
};

/**
 * Create and persist a notification, then push via SSE
 */
const createNotification = async ({ userId, type, title, message, data }) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null,
      },
    });

    // Push via SSE if user is connected
    sendToUser(userId, 'notification', {
      id: notification.id,
      type,
      title,
      message,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (error) {
    logger.error(`Notification creation failed: ${error.message}`);
  }
};

/**
 * Get user notifications with pagination
 */
const getUserNotifications = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [total, notifications, unreadCount] = await Promise.all([
    prisma.notification.count({ where: { userId } }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return {
    data: notifications,
    unreadCount,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Mark notification(s) as read
 */
const markAsRead = async (userId, notificationId) => {
  if (notificationId) {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  } else {
    // Mark all as read
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
};

module.exports = {
  addClient,
  sendToUser,
  createNotification,
  getUserNotifications,
  markAsRead,
};
