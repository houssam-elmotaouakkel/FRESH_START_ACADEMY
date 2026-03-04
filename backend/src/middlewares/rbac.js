/**
 * Granular RBAC Permission System
 * Maps roles to specific permissions instead of broad role checks
 */

const PERMISSIONS = {
  // User management
  USERS_LIST: 'users:list',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Course management
  COURSES_CREATE: 'courses:create',
  COURSES_UPDATE: 'courses:update',
  COURSES_DELETE: 'courses:delete',

  // Enrollment management
  ENROLLMENTS_LIST_ALL: 'enrollments:list_all',
  ENROLLMENTS_UPDATE_STATUS: 'enrollments:update_status',
  ENROLLMENTS_DELETE: 'enrollments:delete',

  // Contact / Messages
  CONTACTS_LIST: 'contacts:list',
  CONTACTS_UPDATE: 'contacts:update',
  CONTACTS_DELETE: 'contacts:delete',

  // Testimonials
  TESTIMONIALS_MANAGE: 'testimonials:manage',
  TESTIMONIALS_APPROVE: 'testimonials:approve',

  // Admin metrics
  METRICS_VIEW: 'metrics:view',

  // Own resources (any authenticated user)
  OWN_PROFILE_READ: 'own:profile:read',
  OWN_PROFILE_UPDATE: 'own:profile:update',
  OWN_ENROLLMENTS: 'own:enrollments',
};

/**
 * Role → Permission mapping
 */
const ROLE_PERMISSIONS = {
  ADMIN: Object.values(PERMISSIONS), // Admin has all permissions

  TEACHER: [
    PERMISSIONS.OWN_PROFILE_READ,
    PERMISSIONS.OWN_PROFILE_UPDATE,
    PERMISSIONS.OWN_ENROLLMENTS,
    PERMISSIONS.COURSES_UPDATE, // teachers can update their courses
    PERMISSIONS.ENROLLMENTS_LIST_ALL,
    PERMISSIONS.ENROLLMENTS_UPDATE_STATUS,
  ],

  STUDENT: [
    PERMISSIONS.OWN_PROFILE_READ,
    PERMISSIONS.OWN_PROFILE_UPDATE,
    PERMISSIONS.OWN_ENROLLMENTS,
  ],
};

/**
 * Check if a role has a specific permission
 */
const hasPermission = (role, permission) => {
  const rolePerms = ROLE_PERMISSIONS[role];
  if (!rolePerms) return false;
  return rolePerms.includes(permission);
};

/**
 * Express middleware — requires specific permission(s)
 * @param  {...string} requiredPermissions - One or more permissions (ANY match = allowed)
 */
const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new (require('./errorHandler').ApiError)(401, 'Non authentifié'));
    }

    const userRole = req.user.role;
    const allowed = requiredPermissions.some((perm) => hasPermission(userRole, perm));

    if (!allowed) {
      return next(
        new (require('./errorHandler').ApiError)(
          403,
          `Permission insuffisante. Requis : ${requiredPermissions.join(' | ')}`
        )
      );
    }

    next();
  };
};

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  requirePermission,
};
