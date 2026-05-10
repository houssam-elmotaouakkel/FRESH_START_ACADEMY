const { sendContact } = require('../services/contactService');
const { successResponse } = require('../utils/apiResponse');

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await sendContact({ name, email, phone, subject, message });
    successResponse(res, null, 'Message sent successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact };
