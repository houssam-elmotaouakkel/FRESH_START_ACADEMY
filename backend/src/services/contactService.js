const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');
const { escapeHtml } = require('../utils/sanitize');

const createTransporter = () =>
  nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

const sendContact = async ({ name, email, phone, subject, message }) => {
  // En mode dev sans credentials SMTP, on logue seulement
  if (!config.email.user || !config.email.pass) {
    logger.info('📧 [DEV] Contact reçu (email non envoyé — SMTP non configuré)');
    logger.info(`  Nom: ${name} | Tél: ${phone} | Sujet: ${subject}`);
    logger.info(`  Message: ${message}`);
    return;
  }

  const transporter = createTransporter();

  // Contextual output encoding for the HTML email body (checklist 2.3 / 2.4).
  // Every untrusted field is HTML-entity-encoded; newlines are converted to
  // <br/> only AFTER encoding so the injected tags cannot themselves be forged.
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : '';
  const safeSubject = subject ? escapeHtml(subject) : '';
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  await transporter.sendMail({
    from: config.email.from,
    to: config.email.to,
    replyTo: email,
    subject: `[Fresh Start Academy] ${subject || 'New contact message'}`,
    html: `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
      ${safeSubject ? `<p><strong>Subject:</strong> ${safeSubject}</p>` : ''}
      <hr/>
      <p>${safeMessage}</p>
    `,
  });

  logger.info(`Contact email sent from: ${email}`);
};

module.exports = { sendContact };
