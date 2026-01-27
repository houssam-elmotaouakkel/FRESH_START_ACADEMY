const contactService = require('../services/contactService');
const { successResponse, createdResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Envoyer un message de contact (Public)
 * POST /api/contacts
 */
const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact(req.body);

    createdResponse(res, contact, 'Message envoyé avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Liste tous les messages (Admin)
 * GET /api/contacts
 */
const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactService.getAllContacts(req.query);

    paginatedResponse(
      res,
      result.contacts,
      result.pagination,
      `${result.pagination.total} message(s), ${result.unreadCount} non lu(s)`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un message par ID (Admin)
 * GET /api/contacts/:id
 */
const getContactById = async (req, res, next) => {
  try {
    const contact = await contactService.getContactById(req.params.id);

    successResponse(res, contact, 'Message récupéré');
  } catch (error) {
    next(error);
  }
};

/**
 * Changer le statut d'un message (Admin)
 * PUT /api/contacts/:id/status
 */
const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await contactService.updateContactStatus(
      req.params.id,
      req.body.status
    );

    successResponse(res, contact, 'Statut mis à jour');
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un message (Admin)
 * DELETE /api/contacts/:id
 */
const deleteContact = async (req, res, next) => {
  try {
    await contactService.deleteContact(req.params.id);

    successResponse(res, null, 'Message supprimé');
  } catch (error) {
    next(error);
  }
};

/**
 * Statistiques des messages (Admin)
 * GET /api/contacts/stats
 */
const getContactStats = async (req, res, next) => {
  try {
    const stats = await contactService.getContactStats();

    successResponse(res, stats, 'Statistiques récupérées');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
};