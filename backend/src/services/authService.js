const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const { verifyTotp } = require('./totpService');

const prisma = getDbClient();


//Générer un token JWT
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};


//Générer un refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};


//Calculer la date d'expiration du refresh token
const getRefreshTokenExpiry = () => {
  const expiresIn = config.jwt.refreshExpiresIn || '7d';
  const match = expiresIn.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return new Date(Date.now() + value * multipliers[unit]);
};


//Inscription d'un nouvel utilisateur
const register = async (userData) => {
  const { email, password, firstName, lastName, phone } = userData;

  // Vérifier si l'email existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, 'Cet email est déjà utilisé');
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 12);

  // Générer les tokens avant la transaction
  // (on aura l'ID après la création)
  // Créer l'utilisateur ET le refresh token dans une transaction atomique
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await tx.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return { user, accessToken, refreshToken };
  });

  logger.info(`New user registered: ${email}`);

  return result;
};


//Connexion d'un utilisateur
const login = async (email, password, totpCode) => {
  // Trouver l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, 'Email ou mot de passe incorrect');
  }

  // Vérifier si le compte est actif
  if (!user.isActive) {
    throw new ApiError(403, 'Votre compte a été désactivé');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Email ou mot de passe incorrect');
  }

  // 2FA check: if enabled, require TOTP code
  if (user.totpEnabled) {
    if (!totpCode) {
      return { requires2FA: true, userId: user.id };
    }
    const isValidTotp = verifyTotp(user.totpSecret, totpCode);
    if (!isValidTotp) {
      throw new ApiError(401, 'Code 2FA invalide');
    }
  }

  // Générer les tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Sauvegarder le refresh token en BDD
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  // Mettre à jour la date de dernière connexion
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  logger.info(`User logged in: ${email}`);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};


//Rafraîchir le token d'accès — with token rotation (OWASP best practice)
const refreshAccessToken = async (refreshToken) => {
  // Vérifier si le refresh token existe en BDD
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new ApiError(401, 'Refresh token invalide');
  }

  // Vérifier si le token n'est pas expiré
  if (storedToken.expiresAt < new Date()) {
    // Supprimer le token expiré
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });
    throw new ApiError(401, 'Refresh token expiré');
  }

  // Vérifier le token JWT
  try {
    jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch (error) {
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });
    throw new ApiError(401, 'Refresh token invalide');
  }

  // Token rotation: delete old + issue new refresh token
  await prisma.refreshToken.delete({
    where: { id: storedToken.id },
  });

  const accessToken = generateAccessToken(storedToken.userId);
  const newRefreshToken = generateRefreshToken(storedToken.userId);

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: storedToken.userId,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return { accessToken, refreshToken: newRefreshToken };
};


//Déconnexion - Supprimer le refresh token
const logout = async (refreshToken) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });

  logger.info('User logged out');
};


//Déconnexion de tous les appareils
const logoutAll = async (userId) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });

  logger.info(`User ${userId} logged out from all devices`);
};


//Changer le mot de passe
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, 'Utilisateur non trouvé');
  }

  // Vérifier le mot de passe actuel
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Mot de passe actuel incorrect');
  }

  // Hasher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Mettre à jour le mot de passe ET supprimer tous les tokens atomiquement
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    }),
    prisma.refreshToken.deleteMany({
      where: { userId },
    }),
  ]);

  logger.info(`Password changed for user ${userId}`);
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAll,
  changePassword,
};