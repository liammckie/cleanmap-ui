
/**
 * Sentry initialization module
 * 
 * This module configures and initializes Sentry error tracking.
 * It should be imported as early as possible in the application lifecycle.
 */
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  // Only initialize Sentry in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.init({
      dsn: "https://f3363aeeeeede88b10e39595a79554d3@o4509064558477312.ingest.us.sentry.io/4509064570798080",
      integrations: [],
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      tracesSampleRate: 1.0,
      // Enable debug in development
      debug: process.env.NODE_ENV !== 'production',
      // Only send errors in production by default
      enabled: process.env.NODE_ENV === 'production' || import.meta.env.VITE_ENABLE_SENTRY === 'true',
      // Set environment
      environment: process.env.NODE_ENV || 'development',
    });
    
    console.info('Sentry initialized');
  } else {
    console.info('Sentry initialization skipped in development mode');
  }
};

// Export Sentry for direct usage
export { Sentry };
