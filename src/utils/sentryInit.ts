import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { reactRouterV6Instrumentation } from "@sentry/react";

const routingInstrumentation = reactRouterV6Instrumentation(); // ✅ fixed

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation,
    }),
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});
