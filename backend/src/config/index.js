require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

const jwtSecret = process.env.JWT_SECRET || (!isProduction ? 'dev-secret-change-me' : '');
const jwtRefreshSecret =
  process.env.JWT_REFRESH_SECRET || (!isProduction ? 'dev-refresh-secret-change-me' : '');

if (isProduction && (!jwtSecret || !jwtRefreshSecret)) {
  throw new Error(
    'JWT_SECRET and JWT_REFRESH_SECRET must be set in production environment'
  );
}

const config = {
  // Application
  env,
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || '/api',

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // JWT
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: jwtRefreshSecret,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from:
      process.env.EMAIL_FROM ||
      'Fresh Start Academy <noreply@freshstartacademy.com>',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // File Upload
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10), // 5MB
    path: process.env.UPLOAD_PATH || './uploads',
  },
};

module.exports = config;
