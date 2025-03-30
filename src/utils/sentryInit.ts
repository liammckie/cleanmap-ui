import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { reactRouterV6Instrumentation } from "@sentry/react/dist/reactrouterv6";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: reactRouterV6Instrumentation(),
    }),
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE,
});
