import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { reactRouterV6Instrumentation } from "@sentry/react";
import { toast } from "@/components/ui/use-toast";

// Export Sentry
export { Sentry };

export const initSentry = (): void => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    try {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          new BrowserTracing({
            routingInstrumentation: reactRouterV6Instrumentation(), // ✅ do NOT pass args
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

export const verifySentryToken = async (): Promise<boolean> => {
  if (!import.meta.env.DEV) return true;

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("⚠️ Missing Supabase credentials");
      return false;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/get-sentry-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sentry token fetch failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    if (!data.token) throw new Error("No token returned from Supabase");

    console.log("✅ Sentry token verified");
    return true;
  } catch (error) {
    console.error("❌ Sentry token verification failed:", error);
    toast({
      title: "Sentry Configuration Issue",
      description: `${error instanceof Error ? error.message : String(error)}`,
      variant: "destructive",
    });
    return false;
  }
};