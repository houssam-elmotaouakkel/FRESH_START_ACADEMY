const { z } = require('zod');
const { ALLOWED_EVENTS } = require('../services/conversionEventService');

const eventSchema = z.object({
  event: z.enum(ALLOWED_EVENTS, { message: 'Evenement invalide' }),
  page: z.string().min(1).max(255).trim(),
  ts: z.string().datetime().optional(),
  userId: z.string().max(100).optional().nullable(),
  courseId: z.string().max(100).optional().nullable(),
  ctaId: z.string().max(100).optional().nullable(),
  utm: z
    .object({
      source: z.string().max(120).optional().nullable(),
      medium: z.string().max(120).optional().nullable(),
      campaign: z.string().max(120).optional().nullable(),
    })
    .optional()
    .nullable(),
  meta: z.record(z.string(), z.any()).optional().nullable(),
});

const trackEventSchema = {
  body: eventSchema,
};

const trackEventsBatchSchema = {
  body: z.object({
    events: z.array(eventSchema).min(1).max(100),
  }),
};

module.exports = {
  trackEventSchema,
  trackEventsBatchSchema,
};
