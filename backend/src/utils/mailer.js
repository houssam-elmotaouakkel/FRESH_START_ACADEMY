/**
 * Singleton nodemailer transporter.
 * Re-uses a single SMTP connection pool instead of creating a new one per email.
 */
const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      pool: true,
      maxConnections: 3,
    });
  }
  return transporter;
}

module.exports = { getTransporter };
