const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis = null;

/**
 * Initialize Redis connection
 * Falls back gracefully if Redis is unavailable
 */
const initRedis = () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('Redis: max retries reached, operating without cache');
          return null; // stop retrying
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.warn(`Redis error: ${err.message}`));

    redis.connect().catch(() => {
      logger.warn('Redis unavailable — cache disabled');
      redis = null;
    });
  } catch {
    logger.warn('Redis initialization failed — cache disabled');
    redis = null;
  }
};

/**
 * Get cached value
 */
const get = async (key) => {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.debug(`Cache get error: ${err.message}`);
    return null;
  }
};

/**
 * Set cache with TTL (seconds)
 */
const set = async (key, value, ttl = 300) => {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.debug(`Cache set error: ${err.message}`);
  }
};

/**
 * Delete a specific key
 */
const del = async (key) => {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    logger.debug(`Cache del error: ${err.message}`);
  }
};

/**
 * Invalidate all keys matching a pattern (uses SCAN for production safety)
 */
const invalidatePattern = async (pattern) => {
  if (!redis) return;
  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch (err) {
    logger.debug(`Cache invalidatePattern error: ${err.message}`);
  }
};

/**
 * Express middleware for caching GET responses
 * @param {string} prefix - Cache key prefix
 * @param {number} ttl - TTL in seconds
 */
const cacheMiddleware = (prefix, ttl = 300) => {
  return async (req, res, next) => {
    if (!redis || req.method !== 'GET') return next();

    const key = `${prefix}:${req.originalUrl}`;
    const cached = await get(key);

    if (cached) {
      return res.json(cached);
    }

    // Intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        set(key, body, ttl);
      }
      return originalJson(body);
    };

    next();
  };
};

/**
 * Check Redis connection status
 */
const isConnected = () => redis && redis.status === 'ready';

module.exports = {
  initRedis,
  get,
  set,
  del,
  invalidatePattern,
  cacheMiddleware,
  isConnected,
};
