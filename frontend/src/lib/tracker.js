// Tracker disabled — no analytics backend
const noop = () => {};

export const initAnalytics = noop;
export const shutdownAnalytics = noop;
export const trackEvent = noop;
export const trackPageView = noop;
export const trackCtaClick = noop;
export const trackCourseView = noop;
export const trackEnrollClick = noop;
export const trackFormStart = noop;
export const trackFormSubmitSuccess = noop;
export const trackFormSubmitError = noop;
export const trackRegisterSuccess = noop;
export const captureUtmFromSearch = () => null;
export const getStoredUtm = () => null;
export const EVENTS = Object.freeze({});
