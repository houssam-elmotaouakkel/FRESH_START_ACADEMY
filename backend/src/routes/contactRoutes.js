const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validate, authenticate, authorize, contactLimiter } = require('../middlewares');
const {
  createContactSchema,
  updateStatusSchema,
  contactIdSchema,
  listContactsSchema,
} = require('../validators/contactValidator');

// ============================================
// Route Publique
// ============================================

/**
 * @route   POST /api/contacts
 * @desc    Envoyer un message de contact
 * @access  Public (avec rate limiting)
 */
router.post(
  '/',
  contactLimiter,
  validate(createContactSchema),
  contactController.createContact
);

// ============================================
// Routes Admin
// ============================================

/**
 * @route   GET /api/contacts/stats
 * @desc    Statistiques des messages
 * @access  Admin
 */
router.get(
  '/stats',
  authenticate,
  authorize('ADMIN'),
  contactController.getContactStats
);

/**
 * @route   GET /api/contacts
 * @desc    Liste tous les messages
 * @access  Admin
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(listContactsSchema),
  contactController.getAllContacts
);

/**
 * @route   GET /api/contacts/:id
 * @desc    Détails d'un message
 * @access  Admin
 */
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(contactIdSchema),
  contactController.getContactById
);

/**
 * @route   PUT /api/contacts/:id/status
 * @desc    Changer le statut
 * @access  Admin
 */
router.put(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate(updateStatusSchema),
  contactController.updateContactStatus
);

/**
 * @route   DELETE /api/contacts/:id
 * @desc    Supprimer un message
 * @access  Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(contactIdSchema),
  contactController.deleteContact
);

module.exports = router;