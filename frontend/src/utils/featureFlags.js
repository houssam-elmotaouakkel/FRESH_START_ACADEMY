export const FEATURE_FLAGS = {
  conversionHome: import.meta.env.VITE_FF_CONVERSION_HOME !== 'false',
  adminConversionMetrics: import.meta.env.VITE_FF_ADMIN_CONVERSION !== 'false',
  analyticsEnabled: import.meta.env.VITE_FF_ANALYTICS !== 'false',
};
