const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const { encrypt, decrypt } = require('../utils/encryption');

const prisma = getDbClient();

const ISSUER = 'FreshStartAcademy';

/**
 * Generate a TOTP secret and QR code for setup
 */
const setupTotp = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'Utilisateur non trouvé');

  if (user.totpEnabled) {
    throw new ApiError(400, '2FA est déjà activé');
  }

  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(user.email, ISSUER, secret);

  // Store secret encrypted at rest
  await prisma.user.update({
    where: { id: userId },
    data: { totpSecret: encrypt(secret) },
  });

  // Generate QR code as data URL
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

  return { secret, qrCodeUrl };
};

/**
 * Verify a TOTP code and enable 2FA
 */
const enableTotp = async (userId, code) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'Utilisateur non trouvé');

  if (!user.totpSecret) {
    throw new ApiError(400, 'Veuillez d\'abord configurer le 2FA');
  }

  const isValid = authenticator.verify({ token: code, secret: decrypt(user.totpSecret) });
  if (!isValid) {
    throw new ApiError(400, 'Code TOTP invalide');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { totpEnabled: true },
  });

  logger.info(`2FA enabled for user ${userId}`);
  return true;
};

/**
 * Verify TOTP during login
 */
const verifyTotp = (encryptedSecret, code) => {
  return authenticator.verify({ token: code, secret: decrypt(encryptedSecret) });
};

/**
 * Disable 2FA
 */
const disableTotp = async (userId, code) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'Utilisateur non trouvé');

  if (!user.totpEnabled) {
    throw new ApiError(400, '2FA n\'est pas activé');
  }

  const isValid = authenticator.verify({ token: code, secret: decrypt(user.totpSecret) });
  if (!isValid) {
    throw new ApiError(400, 'Code TOTP invalide');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { totpSecret: null, totpEnabled: false },
  });

  logger.info(`2FA disabled for user ${userId}`);
  return true;
};

module.exports = { setupTotp, enableTotp, verifyTotp, disableTotp };
