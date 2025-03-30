import * as Sentry from "@sentry/react";
import { BrowserTracing, Replay } from "@sentry/browser";
import { reactRouterV6Instrumentation } from "@sentry/react";
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
      dsn: "https://ffa7539c938a11e1a39a3bf96b87fb99@o4509064558477312.ingest.us.sentry.io/4509064656519168",
      integrations: [
        new BrowserTracing({
          // Set sampling based on route changes
          routingInstrumentation: reactRouterV6Instrumentation(history),
        }),
        new Replay(),
      ],
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
      // Configure session replay
      replaysSessionSampleRate: 0.1, // Sample 10% of sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
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
    
    // Use the full URL instead of relative path
    const edgeFunctionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-sentry-token`;
    console.log('Calling edge function at:', edgeFunctionUrl);
    
    const response = await fetch(
      edgeFunctionUrl,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      }
    );
    
    // Log response details for debugging
    console.log('Edge function response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching Sentry token: ${response.status} ${response.statusText}`, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('Edge function response received:', !!data);
    
    if (!data?.token) {
      console.error('No token returned from get-sentry-token function');
      return null;
    }
    
    // Cache the token for future use
    sentryAuthTokenCache = data.token;
    // Mask token for logging
    const maskedToken = sentryAuthTokenCache.substring(0, 4) + "..." + 
      sentryAuthTokenCache.substring(sentryAuthTokenCache.length - 4);
    console.log(`Sentry auth token fetched and cached successfully: ${maskedToken}`);
    
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
