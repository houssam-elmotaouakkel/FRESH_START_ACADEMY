const { getDbClient } = require('../config/database');
const { readEvents } = require('./conversionEventService');

const prisma = getDbClient();

const buildDateRange = (from, to) => {
  const end = to ? new Date(to) : new Date();
  const start = from ? new Date(from) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    start,
    end,
  };
};

const getConversionMetrics = async (options = {}) => {
  const { start, end } = buildDateRange(options.from, options.to);
  const dateRange = {
    gte: start,
    lte: end,
  };

  const [events, contactsSubmitted, enrollmentsCreated, registrations] = await Promise.all([
    readEvents({ from: start.toISOString(), to: end.toISOString() }),
    prisma.contact.count({ where: { createdAt: dateRange } }),
    prisma.enrollment.count({ where: { enrolledAt: dateRange } }),
    prisma.user.count({ where: { createdAt: dateRange } }),
  ]);

  const countByEvent = events.reduce((accumulator, event) => {
    accumulator[event.event] = (accumulator[event.event] || 0) + 1;
    return accumulator;
  }, {});

  const landingViews = events.filter(
    (event) => event.event === 'page_view' && (event.page === '/' || event.page.startsWith('/?'))
  ).length;

  const coursesViews = events.filter(
    (event) =>
      event.event === 'page_view' &&
      (event.page === '/courses' || event.page.startsWith('/courses?'))
  ).length;

  const courseDetailViews = events.filter(
    (event) =>
      event.event === 'page_view' &&
      /^\/courses\/[^/?#]+/.test(event.page || '')
  ).length;

  const leadEvents = events.filter(
    (event) =>
      event.event === 'form_submit_success' &&
      (event.meta?.formType === 'contact' || event.meta?.formType === 'register')
  ).length;

  const registerSuccessEvents = events.filter((event) => event.event === 'register_success').length;
  const successEvents = leadEvents + registerSuccessEvents;

  const ctaClicks = events
    .filter((event) => event.event === 'cta_click' && event.ctaId)
    .reduce((accumulator, event) => {
      accumulator[event.ctaId] = (accumulator[event.ctaId] || 0) + 1;
      return accumulator;
    }, {});

  const topCtas = Object.entries(ctaClicks)
    .map(([ctaId, clicks]) => ({ ctaId, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8);

  return {
    range: {
      from: start.toISOString(),
      to: end.toISOString(),
    },
    funnel: {
      landing: landingViews,
      courses: coursesViews,
      courseDetail: courseDetailViews,
      lead: leadEvents,
      success: successEvents,
      conversionRate:
        landingViews > 0 ? Number(((successEvents / landingViews) * 100).toFixed(2)) : 0,
    },
    totals: {
      contactsSubmitted,
      enrollmentsCreated,
      registrations,
      trackedEvents: events.length,
    },
    eventsByType: countByEvent,
    topCtas,
  };
};

module.exports = {
  getConversionMetrics,
};
