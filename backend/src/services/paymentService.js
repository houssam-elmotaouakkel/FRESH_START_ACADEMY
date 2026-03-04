const crypto = require('crypto');
const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const { createNotification } = require('./notificationService');

const prisma = getDbClient();

/**
 * Create a payment intent
 */
const createPayment = async ({ userId, courseId }) => {
  // Verify course exists and get price
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new ApiError(404, 'Cours non trouvé');
  if (!course.isActive) throw new ApiError(400, 'Ce cours n\'est plus disponible');

  // Check if user already has a completed payment for this course
  const existingPayment = await prisma.payment.findFirst({
    where: { userId, courseId, status: 'COMPLETED' },
  });
  if (existingPayment) throw new ApiError(400, 'Vous avez déjà payé pour ce cours');

  // Generate unique transaction ID
  const transactionId = `FSA-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const payment = await prisma.payment.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      currency: 'MAD',
      method: 'card',
      transactionId,
    },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  return {
    paymentId: payment.id,
    transactionId,
    amount: payment.amount,
    currency: payment.currency,
    courseTitle: course.title,
  };
};

/**
 * Confirm a payment (simulate gateway callback)
 * @param {string} paymentId - Payment UUID
 * @param {string} requestUserId - ID of the user making the request (ownership check)
 */
const confirmPayment = async (paymentId, requestUserId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { user: true },
  });

  if (!payment) throw new ApiError(404, 'Paiement non trouvé');
  if (payment.status !== 'PENDING') throw new ApiError(400, 'Ce paiement ne peut pas être confirmé');

  // Ownership check: only the payment owner can confirm
  if (payment.userId !== requestUserId) {
    throw new ApiError(403, 'Vous ne pouvez pas confirmer ce paiement');
  }

  // Update payment status + create enrollment
  const [updatedPayment] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'COMPLETED', paidAt: new Date() },
    }),
    prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId: payment.userId, courseId: payment.courseId },
      },
      create: {
        userId: payment.userId,
        courseId: payment.courseId,
        status: 'CONFIRMED',
      },
      update: {
        status: 'CONFIRMED',
      },
    }),
  ]);

  // Notify user
  await createNotification({
    userId: payment.userId,
    type: 'PAYMENT_CONFIRMED',
    title: 'Paiement confirmé',
    message: `Votre paiement de ${payment.amount} ${payment.currency} a été confirmé.`,
    data: { paymentId, transactionId: payment.transactionId },
  });

  logger.info(`Payment ${paymentId} confirmed for user ${payment.userId}`);
  return updatedPayment;
};

/**
 * Get user payments
 */
const getUserPayments = async (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get all payments (admin)
 */
const getAllPayments = async ({ page = 1, limit = 20, status }) => {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [total, payments] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return {
    data: payments,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

module.exports = { createPayment, confirmPayment, getUserPayments, getAllPayments };
