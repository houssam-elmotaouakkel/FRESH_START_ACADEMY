const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const logger = require('./logger');

const UPLOAD_DIR = path.resolve('./uploads');

/**
 * Process an uploaded image:
 * - Resize to max dimensions
 * - Convert to WebP
 * - Generate thumbnail
 *
 * @param {string} filePath - Absolute path to the uploaded image
 * @param {object} options
 * @returns {object} { optimized, thumbnail }
 */
const processImage = async (
  filePath,
  {
    maxWidth = 1200,
    maxHeight = 800,
    thumbnailWidth = 300,
    thumbnailHeight = 200,
    quality = 80,
  } = {}
) => {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  const optimizedPath = path.join(dir, `${baseName}.webp`);
  const thumbnailPath = path.join(dir, `${baseName}_thumb.webp`);

  try {
    // Optimized full-size image
    await sharp(filePath)
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(optimizedPath);

    // Thumbnail
    await sharp(filePath)
      .resize(thumbnailWidth, thumbnailHeight, { fit: 'cover' })
      .webp({ quality: 70 })
      .toFile(thumbnailPath);

    // Clean up original if it's not already WebP
    if (ext.toLowerCase() !== '.webp') {
      await fs.unlink(filePath).catch(() => {});
    }

    logger.info(`Image processed: ${baseName}.webp + thumbnail`);

    return {
      optimized: path.relative(UPLOAD_DIR, optimizedPath),
      thumbnail: path.relative(UPLOAD_DIR, thumbnailPath),
    };
  } catch (error) {
    logger.error(`Image processing failed: ${error.message}`);
    // Return original on failure
    return {
      optimized: path.relative(UPLOAD_DIR, filePath),
      thumbnail: null,
    };
  }
};

/**
 * Multer integration: process after upload
 */
const processUploadedImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const result = await processImage(req.file.path);
    req.file.optimizedPath = result.optimized;
    req.file.thumbnailPath = result.thumbnail;
  } catch {
    // Continue with original file
  }

  next();
};

module.exports = { processImage, processUploadedImage };
