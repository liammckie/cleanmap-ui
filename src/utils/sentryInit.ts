
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { reactRouterV6Instrumentation } from "@sentry/react";
import { toast } from "@/components/ui/use-toast";
import type { RouteObject } from "react-router-dom";
import { useLocation, createRoutesFromChildren, matchRoutes } from "react-router-dom";

// Export Sentry for use in other files
export { Sentry };

// Initialize Sentry function that can be called from main.tsx
export const initSentry = (): void => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    try {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          new BrowserTracing({
            routingInstrumentation: reactRouterV6Instrumentation(
              // 1. History callback - not needed for React Router v6 when using browserRouter
              history => history,
              // 2. Routes - empty array that will be populated at runtime
              [] as RouteObject[],
              // 3. Match path utility function - must return a function that accepts Location
              () => {
                return (location) => matchRoutes([] as RouteObject[], location) || [];
              },
              // 4. The React Router major version (required parameter)
              6,
              // 5. Common routing components to handle routing instrumentation
              {
                routes: [] as RouteObject[],
                // 6. Route filter function (optional parameter)
                routeFilter: (route) => {
                  // Include all routes by default
                  return true;
                }
              }
            ),
          }),
        ],
        tracesSampleRate: 1.0,
        environment: import.meta.env.MODE,
        // Enable debug in development
        debug: import.meta.env.DEV,
        // Only send errors in production by default
        enabled: import.meta.env.PROD,
      });

      console.log("Sentry initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Sentry:", error);
    }
  } else {
    console.warn("Sentry DSN not found. Error tracking disabled.");
  }
};

// Expose a function to verify the Sentry token for development purposes
export const verifySentryToken = async (): Promise<boolean> => {
  if (!import.meta.env.DEV) {
    return true; // Skip verification in production
  }

  try {
    // Get Supabase URL and key from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Missing Supabase credentials - cannot verify Sentry token");
      return false;
    }
    
    console.log("Fetching Sentry auth token from edge function...");
    console.log("Supabase client available:", !!supabaseUrl);
    console.log("Supabase functions available:", !!supabaseKey);
    console.log("Calling edge function at:", `${supabaseUrl}/functions/v1/get-sentry-token`);
    
    const response = await fetch(
      `${supabaseUrl}/functions/v1/get-sentry-token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
        },
      }
    );
    
    console.log("Edge function response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to retrieve Sentry token: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.token) {
      throw new Error("No token returned");
    }
    
    console.log("Successfully verified Sentry token access");
    return true;
  } catch (error) {
    console.error("Sentry token verification failed:", error);
    
    // Show toast notification in development
    if (import.meta.env.DEV) {
      toast({
        title: "Sentry Configuration Issue",
        description: `Error verifying Sentry token: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    }
    
    return false;
  }
};
