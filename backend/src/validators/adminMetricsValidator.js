const { z } = require('zod');

const conversionMetricsQuerySchema = {
  query: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }),
};

module.exports = {
  conversionMetricsQuerySchema,
};
