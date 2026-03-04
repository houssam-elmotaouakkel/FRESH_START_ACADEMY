const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const { getPagination } = require('../utils/helpers');
const logger = require('../utils/logger');

const prisma = getDbClient();

/**
 * Créer un message de contact (Public)
 */
const createContact = async (data) => {
  const contact = await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      status: 'UNREAD',
    },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      createdAt: true,
    },
  });

  logger.info(`New contact message from: ${data.email}`);

  return contact;
};

/**
 * Récupérer tous les messages (Admin)
 */
const getAllContacts = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const { skip, take } = getPagination(page, limit);

  // Construire les filtres
  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { subject: { contains: search } },
      { message: { contains: search } },
    ];
  }

  // Parallel queries for performance
  const [total, unreadCount, contacts] = await Promise.all([
    prisma.contact.count({ where }),
    prisma.contact.count({ where: { status: 'UNREAD' } }),
    prisma.contact.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        subject: true,
        message: true,
        status: true,
        repliedAt: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    contacts,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Récupérer un message par ID (Admin)
 */
const getContactById = async (id) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Message non trouvé');
  }

  // Marquer comme lu automatiquement si non lu
  if (contact.status === 'UNREAD') {
    await prisma.contact.update({
      where: { id },
      data: { status: 'READ' },
    });
    contact.status = 'READ';
  }

  return contact;
};

/**
 * Changer le statut d'un message (Admin)
 */
const updateContactStatus = async (id, status) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Message non trouvé');
  }

  const updateData = { status };

  // Si marqué comme répondu, ajouter la date
  if (status === 'REPLIED') {
    updateData.repliedAt = new Date();
  }

  const updated = await prisma.contact.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      repliedAt: true,
    },
  });

  logger.info(`Contact ${id} status updated to ${status}`);

  return updated;
};

/**
 * Supprimer un message (Admin)
 */
const deleteContact = async (id) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Message non trouvé');
  }

  await prisma.contact.delete({
    where: { id },
  });

  logger.info(`Contact ${id} deleted`);
};

/**
 * Statistiques des messages (Admin)
 */
const getContactStats = async () => {
  const stats = await prisma.contact.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  });

  const total = await prisma.contact.count();

  const formattedStats = {
    total,
    byStatus: {},
  };

  stats.forEach((stat) => {
    formattedStats.byStatus[stat.status] = stat._count.id;
  });

  return formattedStats;
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
};