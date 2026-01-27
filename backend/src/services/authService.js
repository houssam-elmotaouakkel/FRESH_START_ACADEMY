const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

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
  const days = parseInt(config.jwt.refreshExpiresIn) || 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
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

  // Créer l'utilisateur
  const user = await prisma.user.create({
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

  logger.info(`New user registered: ${email}`);

  return {
    user,
    accessToken,
    refreshToken,
  };
};


//Connexion d'un utilisateur
const login = async (email, password) => {
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


//Rafraîchir le token d'accès
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

  // Générer un nouveau access token
  const accessToken = generateAccessToken(storedToken.userId);

  return { accessToken };
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

  // Mettre à jour le mot de passe
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Supprimer tous les refresh tokens (déconnexion de tous les appareils)
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });

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