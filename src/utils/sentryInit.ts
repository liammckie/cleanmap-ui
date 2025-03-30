
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { reactRouterV6Instrumentation } from "@sentry/react";
import { toast } from "@/hooks/use-toast";
import React from 'react';

// Export Sentry for use in other files
export { Sentry };

// Initialize Sentry function
export const initSentry = (): void => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    try {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          new BrowserTracing({
            routingInstrumentation: reactRouterV6Instrumentation(
              React.useEffect,
              () => {
                return {
                  pathname: window.location.pathname,
                  search: window.location.search,
                  hash: window.location.hash
                };
              },
              // Routes array (optional)
              [],
              // matchPath function (required)
              (pattern, path) => {
                if (pattern === path) return { path, params: {} };
                return null;
              },
              // history implementation (required for React Router v6)
              {
                action: 'POP',
                location: window.location,
                createHref: (location) => location.pathname,
                push: () => {},
                replace: () => {},
                go: () => {},
                back: () => {},
                forward: () => {},
                listen: () => () => {},
                block: () => () => {},
              }
            ),
          }),
        ],
        tracesSampleRate: 1.0,
        environment: import.meta.env.MODE,
        debug: import.meta.env.DEV,
        enabled: import.meta.env.PROD,
      });

      console.log("✅ Sentry initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Sentry:", error);
    }
  } else {
    console.warn("⚠️ Sentry DSN not found. Error tracking disabled.");
  }
};

// Verify Sentry token in DEV using Supabase edge function
export const verifySentryToken = async (): Promise<boolean> => {
  if (!import.meta.env.DEV) return true;

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("⚠️ Missing Supabase credentials - cannot verify Sentry token");
      return false;
    }

    console.log("🔄 Verifying Sentry token from edge function:", `${supabaseUrl}/functions/v1/get-sentry-token`);

    const response = await fetch(`${supabaseUrl}/functions/v1/get-sentry-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to retrieve Sentry token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    if (!data.token) throw new Error("No token returned");

    console.log("✅ Successfully verified Sentry token access");
    return true;
  } catch (error) {
    console.error("❌ Sentry token verification failed:", error);
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
