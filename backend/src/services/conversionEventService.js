const fs = require('node:fs/promises');
const path = require('node:path');
const logger = require('../utils/logger');

const ALLOWED_EVENTS = [
  'page_view',
  'cta_click',
  'course_view',
  'enroll_click',
  'form_start',
  'form_submit_success',
  'form_submit_error',
  'register_success',
];

const logFilePath = path.join(__dirname, '../../logs/conversion-events.log');

const toIsoString = (value) => {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
};

const ensureLogDirectory = async () => {
  await fs.mkdir(path.dirname(logFilePath), { recursive: true });
};

const normalizeEvent = (event, context = {}) => {
  const normalized = {
    event: event.event,
    page: (event.page || '/').slice(0, 255),
    ts: toIsoString(event.ts),
    userId: event.userId || null,
    courseId: event.courseId || null,
    ctaId: event.ctaId || null,
    utm: event.utm || null,
    meta: event.meta || null,
    ip: context.ip || null,
    userAgent: context.userAgent || null,
  };

  return normalized;
};

const appendEvents = async (events) => {
  if (!events.length) {
    return;
  }

  await ensureLogDirectory();
  const lines = `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;
  await fs.appendFile(logFilePath, lines, 'utf8');
};

const trackEvent = async (event, context = {}) => {
  const normalized = normalizeEvent(event, context);
  await appendEvents([normalized]);
  return normalized;
};

const trackEventsBatch = async (events, context = {}) => {
  const normalizedEvents = events.map((event) => normalizeEvent(event, context));
  await appendEvents(normalizedEvents);
  return normalizedEvents.length;
};

const readEvents = async (options = {}) => {
  const fromDate = options.from ? new Date(options.from) : null;
  const toDate = options.to ? new Date(options.to) : null;

  try {
    const content = await fs.readFile(logFilePath, 'utf8');
    const events = [];

    for (const line of content.split('\n')) {
      if (!line.trim()) {
        continue;
      }

      try {
        const parsed = JSON.parse(line);
        const eventDate = new Date(parsed.ts);
        if (Number.isNaN(eventDate.getTime())) {
          continue;
        }
        if (fromDate && eventDate < fromDate) {
          continue;
        }
        if (toDate && eventDate > toDate) {
          continue;
        }
        events.push(parsed);
      } catch (error) {
        logger.warn(`Invalid analytics event line skipped: ${error.message}`);
      }
    }

    return events;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

module.exports = {
  ALLOWED_EVENTS,
  trackEvent,
  trackEventsBatch,
  readEvents,
};
