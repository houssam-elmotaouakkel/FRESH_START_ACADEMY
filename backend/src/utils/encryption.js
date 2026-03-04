const crypto = require('crypto');
const config = require('../config');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Derive a 32-byte key from the JWT secret (used for TOTP secret encryption)
 * In production, use a dedicated ENCRYPTION_KEY env var
 */
const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_KEY || config.jwt.secret;
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypt a plaintext string using AES-256-GCM
 * @param {string} plaintext
 * @returns {string} - Format: iv:authTag:ciphertext (hex-encoded)
 */
const encrypt = (plaintext) => {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt a ciphertext string encrypted with AES-256-GCM
 * @param {string} encryptedText - Format: iv:authTag:ciphertext
 * @returns {string} - The original plaintext
 */
const decrypt = (encryptedText) => {
  const key = getEncryptionKey();
  const parts = encryptedText.split(':');

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const ciphertext = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

module.exports = { encrypt, decrypt };
