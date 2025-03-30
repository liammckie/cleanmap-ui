
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Only use Sentry plugin in production
    mode === "production" && sentryVitePlugin({
      org: "cleanmap",
      project: "cleanmap-ui",
      // Auth token will be fetched during the build process
      // We'll rely on the CI/CD environment having this token
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps in production for Sentry
    sourcemap: true,
  },
}));
