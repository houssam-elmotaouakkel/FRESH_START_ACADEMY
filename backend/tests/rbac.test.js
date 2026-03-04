/**
 * Unit tests — RBAC permissions system
 */
const { PERMISSIONS, ROLE_PERMISSIONS, hasPermission } = require('../src/middlewares/rbac');

describe('RBAC — hasPermission', () => {
  test('ADMIN has every permission', () => {
    const allPerms = Object.values(PERMISSIONS);
    allPerms.forEach((perm) => {
      expect(hasPermission('ADMIN', perm)).toBe(true);
    });
  });

  test('STUDENT has own profile permissions', () => {
    expect(hasPermission('STUDENT', PERMISSIONS.OWN_PROFILE_READ)).toBe(true);
    expect(hasPermission('STUDENT', PERMISSIONS.OWN_PROFILE_UPDATE)).toBe(true);
    expect(hasPermission('STUDENT', PERMISSIONS.OWN_ENROLLMENTS)).toBe(true);
  });

  test('STUDENT cannot manage users', () => {
    expect(hasPermission('STUDENT', PERMISSIONS.USERS_LIST)).toBe(false);
    expect(hasPermission('STUDENT', PERMISSIONS.USERS_DELETE)).toBe(false);
  });

  test('TEACHER can update courses', () => {
    expect(hasPermission('TEACHER', PERMISSIONS.COURSES_UPDATE)).toBe(true);
  });

  test('TEACHER cannot delete courses', () => {
    expect(hasPermission('TEACHER', PERMISSIONS.COURSES_DELETE)).toBe(false);
  });

  test('unknown role has no permissions', () => {
    expect(hasPermission('GHOST', PERMISSIONS.USERS_LIST)).toBe(false);
  });
});

describe('RBAC — ROLE_PERMISSIONS structure', () => {
  test('ADMIN permissions include all enum values', () => {
    const allPerms = Object.values(PERMISSIONS);
    expect(ROLE_PERMISSIONS.ADMIN).toEqual(expect.arrayContaining(allPerms));
    expect(ROLE_PERMISSIONS.ADMIN.length).toBe(allPerms.length);
  });

  test('STUDENT permissions are a subset of ADMIN', () => {
    ROLE_PERMISSIONS.STUDENT.forEach((perm) => {
      expect(ROLE_PERMISSIONS.ADMIN).toContain(perm);
    });
  });

  test('TEACHER permissions are a subset of ADMIN', () => {
    ROLE_PERMISSIONS.TEACHER.forEach((perm) => {
      expect(ROLE_PERMISSIONS.ADMIN).toContain(perm);
    });
  });
});
