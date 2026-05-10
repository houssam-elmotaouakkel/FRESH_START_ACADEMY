/**
 * Integration tests — Course endpoints (supertest)
 */
const request = require('supertest');
const jwt = require('jsonwebtoken');

// ── Mocks ──
const mockCourses = [
  {
    id: '00000000-0000-4000-a000-000000000001',
    title: 'Français Débutant',
    slug: 'francais-debutant',
    description: 'Cours de français pour débutants',
    category: 'LANGUAGES',
    level: 'BEGINNER',
    price: 1500,
    duration: 30,
    maxStudents: 20,
    isOnline: false,
    isActive: true,
    startDate: null,
    endDate: null,
    createdAt: new Date().toISOString(),
    teacher: { id: 't1', firstName: 'Prof', lastName: 'Test' },
    _count: { enrollments: 5 },
  },
];

jest.mock('../src/config/database', () => {
  const mockPrisma = {
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'admin-1',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
      }),
    },
    course: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      groupBy: jest.fn(),
    },
    refreshToken: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
    auditLog: { create: jest.fn() },
  };
  return {
    getDbClient: () => mockPrisma,
    connectDatabase: jest.fn(),
    disconnectDatabase: jest.fn(),
  };
});

jest.mock('../src/services/cacheService', () => ({
  initRedis: jest.fn(),
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn(),
  del: jest.fn(),
  invalidatePattern: jest.fn(),
  isConnected: () => false,
  cacheMiddleware: () => (req, res, next) => next(),
}));

jest.mock('../src/services/totpService', () => ({
  setupTotp: jest.fn(),
  enableTotp: jest.fn(),
  verifyTotp: jest.fn(),
  disableTotp: jest.fn(),
}));

jest.mock('../src/services/notificationService', () => ({
  createNotification: jest.fn(),
  getUserNotifications: jest.fn(),
  markAsRead: jest.fn(),
  addClient: jest.fn(),
  sendToUser: jest.fn(),
}));

const { getDbClient } = require('../src/config/database');
const prisma = getDbClient();
const app = require('../src/app');

// Generate a valid JWT for authenticated requests
const adminToken = jwt.sign(
  { userId: 'admin-1' },
  process.env.JWT_SECRET || 'dev-secret-change-me',
  { expiresIn: '1h' }
);

beforeEach(() => {
  jest.clearAllMocks();
  // Re-setup the user mock for auth middleware
  prisma.user.findUnique.mockResolvedValue({
    id: 'admin-1',
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    isActive: true,
  });
});

describe('GET /api/courses', () => {
  test('returns paginated course list', async () => {
    prisma.course.count.mockResolvedValue(1);
    prisma.course.findMany.mockResolvedValue(mockCourses);

    const res = await request(app).get('/api/courses');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.totalItems).toBe(1);
  });

  test('accepts filter query params', async () => {
    prisma.course.count.mockResolvedValue(0);
    prisma.course.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/courses')
      .query({ category: 'LANGUAGES', level: 'BEGINNER', page: 1, limit: 5 });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('GET /api/courses/:id', () => {
  test('returns a course by ID', async () => {
    prisma.course.findUnique.mockResolvedValue(mockCourses[0]);

    const res = await request(app).get('/api/courses/00000000-0000-4000-a000-000000000001');

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Français Débutant');
  });

  test('returns 404 for unknown course', async () => {
    prisma.course.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/courses/00000000-0000-4000-a000-999999999999');

    expect(res.status).toBe(404);
  });
});

describe('POST /api/courses (Admin)', () => {
  const newCourse = {
    title: 'Anglais Avancé',
    description: 'Advanced English course',
    category: 'LANGUAGES',
    level: 'ADVANCED',
    price: 2000,
    duration: 40,
    maxStudents: 15,
  };

  test('creates a course when authenticated as admin', async () => {
    prisma.course.findUnique.mockResolvedValue(null); // no slug collision
    prisma.course.create.mockResolvedValue({
      id: '00000000-0000-4000-a000-000000000002',
      slug: 'anglais-avance',
      ...newCourse,
      isOnline: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCourse);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Anglais Avancé');
  });

  test('returns 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send(newCourse);

    expect(res.status).toBe(401);
  });

  test('returns 403 for non-admin users', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'student-1',
      email: 'student@test.com',
      firstName: 'Student',
      lastName: 'User',
      role: 'STUDENT',
      isActive: true,
    });

    const studentToken = jwt.sign(
      { userId: 'student-1' },
      process.env.JWT_SECRET || 'dev-secret-change-me',
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${studentToken}`)
      .send(newCourse);

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/courses/:id (Admin)', () => {
  test('deletes a course when authenticated as admin', async () => {
    prisma.course.findUnique.mockResolvedValue(mockCourses[0]);
    prisma.course.delete.mockResolvedValue(mockCourses[0]);

    const res = await request(app)
      .delete('/api/courses/00000000-0000-4000-a000-000000000001')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
