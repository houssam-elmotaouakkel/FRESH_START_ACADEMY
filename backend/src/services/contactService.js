const config = require('../config');
const logger = require('../utils/logger');
const { escapeHtml } = require('../utils/sanitize');

const RESEND_API_URL = 'https://api.resend.com/emails';

const sendContact = async ({ name, email, phone, subject, message }) => {
  // En mode dev sans clé API, on logue seulement
  if (!config.email.resendApiKey) {
    logger.info('📧 [DEV] Contact reçu (email non envoyé — RESEND_API_KEY non configurée)');
    logger.info(`  Nom: ${name} | Tél: ${phone} | Sujet: ${subject}`);
    logger.info(`  Message: ${message}`);
    return;
  }

  // Contextual output encoding for the HTML email body (checklist 2.3 / 2.4).
  // Every untrusted field is HTML-entity-encoded; newlines are converted to
  // <br/> only AFTER encoding so the injected tags cannot themselves be forged.
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : '';
  const safeSubject = subject ? escapeHtml(subject) : '';
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.email.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.email.from,
      to: config.email.to,
      reply_to: email,
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
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }

  logger.info(`Contact email sent from: ${email}`);
};

module.exports = { sendContact };
