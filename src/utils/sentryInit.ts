
/**
 * Sentry initialization module
 * 
 * This module configures and initializes Sentry error tracking.
 * It should be imported as early as possible in the application lifecycle.
 */
import * as Sentry from "@sentry/react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch Sentry configuration from Supabase secrets and initialize
 */
export const initSentry = async () => {
  try {
    // Only initialize Sentry in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
      // Initialize with basic configuration first
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
        // Set release version if available
        release: import.meta.env.VITE_APP_VERSION || 'development',
      });
      
      console.info('Sentry initialized');
    } else {
      console.info('Sentry initialization skipped in development mode');
    }
  } catch (error) {
    console.error('Error initializing Sentry:', error);
  }
};

/**
 * Helper function to get Sentry auth token for source map uploads
 * Can be used during build process via edge functions
 */
export const getSentryAuthToken = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-sentry-token');
    
    if (error) {
      console.error('Error fetching Sentry auth token:', error);
      return null;
    }
    
    return data?.token || null;
  } catch (error) {
    console.error('Error invoking get-sentry-token function:', error);
    return null;
  }
};

// Export Sentry for direct usage
export { Sentry };
