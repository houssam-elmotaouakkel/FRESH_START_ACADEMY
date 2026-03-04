const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const { getTransporter } = require('../utils/mailer');

const prisma = getDbClient();

/**
 * Generate a password reset token and send email
 */
const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Don't reveal if user exists — always return success
  if (!user) {
    logger.warn(`Password reset requested for unknown email: ${email}`);
    return;
  }

  // Delete any existing reset tokens for this user
  await prisma.passwordReset.deleteMany({ where: { userId: user.id } });

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Store in DB — expires in 1 hour
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  // Build reset URL (frontend)
  const resetUrl = `${config.cors.origin}/reset-password?token=${token}`;

  // Send email (graceful — log failure but don't throw)
  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: config.email.from,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe — Fresh Start Academy',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
          <h2 style="color:#0f52ba;">Réinitialisation du mot de passe</h2>
          <p>Bonjour ${user.firstName},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous :</p>
          <a href="${resetUrl}" style="display:inline-block;background:#0f52ba;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
            Réinitialiser mon mot de passe
          </a>
          <p style="color:#666;font-size:13px;">Ce lien expire dans 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        </div>
      `,
    });

    logger.info(`Password reset email sent to ${email}`);
  } catch (err) {
    logger.error(`Failed to send password reset email: ${err.message}`);
  }
};

/**
 * Reset the password using a token
 */
const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token: hashedToken },
  });

  if (!resetRecord) {
    throw new ApiError(400, 'Token de réinitialisation invalide');
  }

  if (resetRecord.expiresAt < new Date()) {
    // Clean up expired token
    await prisma.passwordReset.delete({ where: { id: resetRecord.id } });
    throw new ApiError(400, 'Token de réinitialisation expiré');
  }

  if (resetRecord.used) {
    throw new ApiError(400, 'Ce token a déjà été utilisé');
  }

  // Hash new password and update user
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    }),
    // Invalidate all refresh tokens (force re-login)
    prisma.refreshToken.deleteMany({
      where: { userId: resetRecord.userId },
    }),
  ]);

  logger.info(`Password reset completed for user ${resetRecord.userId}`);
};

module.exports = { requestPasswordReset, resetPassword };
