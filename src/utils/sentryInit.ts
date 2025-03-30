
/**
 * Sentry initialization module
 * 
 * This module configures and initializes Sentry error tracking.
 * It should be imported as early as possible in the application lifecycle.
 */
import * as Sentry from "@sentry/react";
import { supabase } from "@/integrations/supabase/client";

// Cache the Sentry token to avoid unnecessary API calls
let sentryAuthTokenCache: string | null = null;

/**
 * Fetch Sentry configuration from Supabase secrets and initialize
 */
export const initSentry = async () => {
  try {
    console.info('Initializing Sentry...');
    
    // Initialize with basic configuration first - always enabled
    Sentry.init({
      dsn: "https://f3363aeeeeede88b10e39595a79554d3@o4509064558477312.ingest.us.sentry.io/4509064570798080",
      integrations: [],
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      tracesSampleRate: 1.0,
      // Enable debug in development
      debug: process.env.NODE_ENV !== 'production',
      // Enable in all environments
      enabled: true,
      // Set environment
      environment: process.env.NODE_ENV || 'development',
      // Set release version if available
      release: import.meta.env.VITE_APP_VERSION || 'development',
    });
    
    console.info('Sentry initialized with release:', import.meta.env.VITE_APP_VERSION || 'development');
  } catch (error) {
    console.error('Error initializing Sentry:', error);
  }
};

/**
 * Helper function to get Sentry auth token for source map uploads
 * Can be used during build process via edge functions
 * 
 * Implements caching to avoid repeated API calls
 */
export const getSentryAuthToken = async (): Promise<string | null> => {
  try {
    // Return cached token if available
    if (sentryAuthTokenCache) {
      console.log('Using cached Sentry auth token');
      return sentryAuthTokenCache;
    }
    
    // First check if token is available via environment variable
    if (import.meta.env.VITE_SENTRY_AUTH_TOKEN) {
      console.log('Using Sentry auth token from environment variable');
      sentryAuthTokenCache = import.meta.env.VITE_SENTRY_AUTH_TOKEN;
      return sentryAuthTokenCache;
    }
    
    console.log('Fetching Sentry auth token from edge function...');
    
    // Add detailed logging to diagnose issues
    console.log('Supabase client available:', !!supabase);
    console.log('Supabase functions available:', !!supabase.functions);
    
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-sentry-token`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching Sentry token: ${response.status} ${response.statusText}`, errorText);
      return null;
    }
    
    const data = await response.json();
    
    if (!data?.token) {
      console.error('No token returned from get-sentry-token function');
      return null;
    }
    
    // Cache the token for future use
    sentryAuthTokenCache = data.token;
    console.log('Sentry auth token fetched and cached successfully');
    
    return sentryAuthTokenCache;
  } catch (error) {
    console.error('Error getting Sentry auth token:', error);
    return null;
  }
};

/**
 * Verify that the Sentry token is correctly configured and can be retrieved
 * This is useful for confirming the setup during development
 */
export const verifySentryToken = async (): Promise<boolean> => {
  try {
    const token = await getSentryAuthToken();
    
    if (!token) {
      console.error('Sentry token verification failed: No token returned');
      return false;
    }
    
    console.log('Sentry token verification successful');
    return true;
  } catch (error) {
    console.error('Sentry token verification failed with error:', error);
    return false;
  }
};

// Export Sentry for direct usage
export { Sentry };
