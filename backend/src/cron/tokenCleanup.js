/**
 * Periodic cleanup of expired refresh tokens and password reset tokens.
 * Runs every 6 hours to keep the database clean.
 */
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

const CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

let intervalId = null;

async function cleanExpiredTokens() {
  try {
    const now = new Date();

    // Delete expired refresh tokens
    const deletedRefresh = await prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    // Delete expired password reset tokens
    const deletedReset = await prisma.passwordReset.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    if (deletedRefresh.count > 0 || deletedReset.count > 0) {
      logger.info(
        `🧹 Token cleanup: removed ${deletedRefresh.count} expired refresh tokens, ${deletedReset.count} expired password resets`
      );
    }
  } catch (error) {
    logger.error('Token cleanup error:', error.message);
  }
}

function startTokenCleanup() {
  // Run once at startup (with a short delay to let DB connect)
  setTimeout(cleanExpiredTokens, 10_000);

  // Then run periodically
  intervalId = setInterval(cleanExpiredTokens, CLEANUP_INTERVAL_MS);
  logger.info('🕐 Token cleanup cron started (every 6h)');
}

function stopTokenCleanup() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

module.exports = { startTokenCleanup, stopTokenCleanup, cleanExpiredTokens };
