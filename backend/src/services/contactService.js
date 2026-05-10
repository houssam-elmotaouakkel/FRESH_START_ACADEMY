const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

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

  await transporter.sendMail({
    from: config.email.from,
    to: config.email.to,
    replyTo: email,
    subject: `[Fresh Start Academy] ${subject || 'New contact message'}`,
    html: `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
      <hr/>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  });

  logger.info(`Contact email sent from: ${email}`);
};

module.exports = { sendContact };
