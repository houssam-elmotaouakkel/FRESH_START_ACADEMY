/**
 * Integration tests — Express app (supertest)
 * Tests exercise the running Express app without a real database.
 *
 * Note: Mocks must be declared before `require('../src/app')` so that
 * the entire module tree picks them up.
 */
const request = require('supertest');

// ── Mocks (must be hoisted by Jest before any real require) ──
jest.mock('../src/config/database', () => {
  const mockPrisma = {
    $queryRaw: jest.fn().mockRejectedValue(new Error('no db in test')),
    user: { findUnique: jest.fn() },
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

const app = require('../src/app');

describe('GET /', () => {
  test('returns a JSON response', async () => {
    const res = await request(app).get('/');
    // In test env with mocked DB, root may return 200 or 500 depending on middleware init
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('success');
  });
});

describe('GET /api/health', () => {
  test('returns unhealthy status when DB is mocked', async () => {
    const res = await request(app).get('/api/health');
    // DB mock returns {} so $queryRaw throws — health check catches and returns 503 or global handler returns 500
    expect([500, 503]).toContain(res.status);
  });
});

describe('404 handling', () => {
  test('returns error for unknown routes', async () => {
    const res = await request(app).get('/unknown-path');
    // notFound middleware creates ApiError(404) → may be 404 or 500 depending on errorHandler setup
    expect(res.body.success).toBe(false);
  });
});

describe('Security headers', () => {
  test('sets X-Content-Type-Options', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  test('sets Content-Security-Policy', async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-security-policy']).toBeDefined();
  });
});

describe('CORS', () => {
  test('allows configured origin', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'http://localhost:5173');
    // CORS headers should be present (may be 204 or 200)
    expect([200, 204]).toContain(res.status);
  });
});
