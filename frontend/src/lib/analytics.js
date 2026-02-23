import publicService from '../services/publicService';
import { captureException } from './monitoring';

const EVENTS = Object.freeze({
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  COURSE_VIEW: 'course_view',
  ENROLL_CLICK: 'enroll_click',
  FORM_START: 'form_start',
  FORM_SUBMIT_SUCCESS: 'form_submit_success',
  FORM_SUBMIT_ERROR: 'form_submit_error',
  REGISTER_SUCCESS: 'register_success',
});

const UTM_STORAGE_KEY = 'fsa_utm';
const CLIENT_ID_STORAGE_KEY = 'fsa_client_id';
const QUEUE_LIMIT = 8;
const FLUSH_INTERVAL_MS = 5000;

let queue = [];
let initialized = false;
let flushTimer = null;

const safeJsonParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getOrCreateClientId = () => {
  const existing = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const generated = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  localStorage.setItem(CLIENT_ID_STORAGE_KEY, generated);
  return generated;
};

export const getStoredUtm = () => {
  const raw = localStorage.getItem(UTM_STORAGE_KEY);
  return safeJsonParse(raw, null);
};

export const captureUtmFromSearch = (search = window.location.search) => {
  const params = new URLSearchParams(search);
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');

  if (!source && !medium && !campaign) {
    return getStoredUtm();
  }

  const payload = {
    source: source || null,
    medium: medium || null,
    campaign: campaign || null,
  };
  localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(payload));
  return payload;
};

const flushQueue = async () => {
  if (!queue.length) {
    return;
  }

  const batch = [...queue];
  queue = [];

  try {
    await publicService.trackEventsBatch(batch);
  } catch (error) {
    queue = [...batch, ...queue].slice(-100);
    captureException(error, { scope: 'analytics.flushQueue', batchSize: batch.length });
  }
};

const scheduleFlush = () => {
  if (queue.length >= QUEUE_LIMIT) {
    flushQueue();
  }
};

const normalizePage = (page) => {
  if (!page) {
    return window.location.pathname;
  }
  return page;
};

export const trackEvent = (event, payload = {}) => {
  if (!event) {
    return;
  }

  const entry = {
    event,
    page: normalizePage(payload.page),
    ts: new Date().toISOString(),
    userId: payload.userId || null,
    courseId: payload.courseId || null,
    ctaId: payload.ctaId || null,
    utm: captureUtmFromSearch(window.location.search),
    meta: {
      ...(payload.meta || {}),
      clientId: getOrCreateClientId(),
    },
  };

  queue.push(entry);
  scheduleFlush();
};

export const trackPageView = (page) => {
  trackEvent(EVENTS.PAGE_VIEW, { page });
};

export const trackCtaClick = (ctaId, payload = {}) => {
  trackEvent(EVENTS.CTA_CLICK, { ...payload, ctaId });
};

export const trackCourseView = (courseId, payload = {}) => {
  trackEvent(EVENTS.COURSE_VIEW, { ...payload, courseId });
};

export const trackEnrollClick = (courseId, payload = {}) => {
  trackEvent(EVENTS.ENROLL_CLICK, { ...payload, courseId });
};

export const trackFormStart = (formType, payload = {}) => {
  trackEvent(EVENTS.FORM_START, {
    ...payload,
    meta: {
      ...(payload.meta || {}),
      formType,
    },
  });
};

export const trackFormSubmitSuccess = (formType, payload = {}) => {
  trackEvent(EVENTS.FORM_SUBMIT_SUCCESS, {
    ...payload,
    meta: {
      ...(payload.meta || {}),
      formType,
    },
  });
};

export const trackFormSubmitError = (formType, payload = {}) => {
  trackEvent(EVENTS.FORM_SUBMIT_ERROR, {
    ...payload,
    meta: {
      ...(payload.meta || {}),
      formType,
      error: payload.error || null,
    },
  });
};

export const trackRegisterSuccess = (payload = {}) => {
  trackEvent(EVENTS.REGISTER_SUCCESS, payload);
};

export const initAnalytics = () => {
  if (initialized) {
    return;
  }
  initialized = true;

  captureUtmFromSearch(window.location.search);
  getOrCreateClientId();

  flushTimer = window.setInterval(() => {
    flushQueue();
  }, FLUSH_INTERVAL_MS);

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      flushQueue();
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('beforeunload', () => {
    flushQueue();
  });
};

export const shutdownAnalytics = () => {
  if (flushTimer) {
    window.clearInterval(flushTimer);
    flushTimer = null;
  }
  flushQueue();
};

export { EVENTS };
