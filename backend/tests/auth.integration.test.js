/**
 * Integration tests — Auth endpoints (supertest)
 * Tests register, login, refresh, logout via mocked services.
 */
const request = require('supertest');

// ── Mocks ──
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'STUDENT',
  isActive: true,
  createdAt: new Date().toISOString(),
};

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

jest.mock('../src/config/database', () => {
  const mockPrisma = {
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    user: { findUnique: jest.fn() },
    refreshToken: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), deleteMany: jest.fn() },
  };
  return {
    getDbClient: () => mockPrisma,
    connectDatabase: jest.fn(),
    disconnectDatabase: jest.fn(),
  };
});

jest.mock('../src/services/cacheService', () => ({
  initRedis: jest.fn(),
  get: jest.fn(),
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

jest.mock('../src/middlewares/rateLimiter', () => ({
  apiLimiter: (req, res, next) => next(),
  authLimiter: (req, res, next) => next(),
  contactLimiter: (req, res, next) => next(),
}));

jest.mock('../src/services/authService', () => ({
  register: jest.fn(),
  login: jest.fn(),
  refreshAccessToken: jest.fn(),
  logout: jest.fn(),
  logoutAll: jest.fn(),
  changePassword: jest.fn(),
}));

const authService = require('../src/services/authService');
const app = require('../src/app');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/register', () => {
  const validPayload = {
    email: 'new@example.com',
    password: 'StrongPass1',
    firstName: 'New',
    lastName: 'User',
  };

  test('returns 201 on successful registration', async () => {
    authService.register.mockResolvedValue({
      user: mockUser,
      ...mockTokens,
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data).toHaveProperty('accessToken');
    // refreshToken should be in httpOnly cookie, not in body
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validPayload, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('returns 409 when email already exists', async () => {
    const { ApiError } = require('../src/middlewares/errorHandler');
    authService.register.mockRejectedValue(new ApiError(409, 'Cet email est déjà utilisé'));

    const res = await request(app)
      .post('/api/auth/register')
      .send(validPayload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  test('returns 200 with user and accessToken on success', async () => {
    authService.login.mockResolvedValue({
      user: mockUser,
      ...mockTokens,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'StrongPass1' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('user');
    // Cookie should be set
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('returns 200 with requires2FA when TOTP enabled', async () => {
    authService.login.mockResolvedValue({ requires2FA: true, userId: 'user-1' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'StrongPass1' });

    expect(res.status).toBe(200);
    expect(res.body.data.requires2FA).toBe(true);
  });

  test('returns 400 for missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });

  test('returns 401 for wrong credentials', async () => {
    const { ApiError } = require('../src/middlewares/errorHandler');
    authService.login.mockRejectedValue(new ApiError(401, 'Email ou mot de passe incorrect'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/refresh-token', () => {
  test('returns new access token from cookie', async () => {
    authService.refreshAccessToken.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    const res = await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', 'refreshToken=mock-refresh-token');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });
});

describe('POST /api/auth/logout', () => {
  test('clears refresh token cookie', async () => {
    authService.logout.mockResolvedValue();

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', 'refreshToken=mock-refresh-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Cookie should be cleared
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
  });
});
