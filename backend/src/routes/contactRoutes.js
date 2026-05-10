const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validate, contactLimiter } = require('../middlewares');
const { createContactSchema } = require('../validators/contactValidator');

router.post('/', contactLimiter, validate(createContactSchema), contactController.createContact);

module.exports = router;
