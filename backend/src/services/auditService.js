const { getDbClient } = require('../config/database');
const logger = require('../utils/logger');

const prisma = getDbClient();

/**
 * Log an audit event
 */
const logAudit = async ({ userId, action, resource, resourceId, details, ip, userAgent }) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        resource,
        resourceId: resourceId || null,
        details: details ? JSON.stringify(details) : null,
        ip: ip || null,
        userAgent: userAgent || null,
      },
    });
  } catch (error) {
    // Never let audit failures break the main flow
    logger.error('Audit log write failed:', error.message);
  }
};

/**
 * Express middleware — automatically logs mutating actions
 */
const auditMiddleware = (action, resource) => {
  return (req, res, next) => {
    // Capture the original res.json to intercept successful responses
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Only log on success (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const resourceId = req.params.id || body?.data?.id || null;
        logAudit({
          userId: req.user?.id,
          action,
          resource,
          resourceId,
          details: { method: req.method, path: req.originalUrl },
          ip: req.ip,
          userAgent: req.get('user-agent'),
        });
      }
      return originalJson(body);
    };

    next();
  };
};

/**
 * Get audit logs with pagination
 */
const getAuditLogs = async ({ page = 1, limit = 50, userId, action, resource }) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (resource) where.resource = resource;

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { logAudit, auditMiddleware, getAuditLogs };
