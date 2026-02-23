export const captureException = (error, context = {}) => {
  if (!error) {
    return;
  }

  if (import.meta.env.DEV) {
    // Keep local debugging easy without external dependencies.
    console.error('Captured exception', { error, context });
  }

  if (window.Sentry && typeof window.Sentry.captureException === 'function') {
    window.Sentry.captureException(error, { extra: context });
  }
};
