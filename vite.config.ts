
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Dynamic imports are not allowed in Vite config, so we can't import directly
  // Instead, we'll dynamically load the token only when needed
  let sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
  
  // Only try to fetch token if in production mode and token isn't already set
  if (mode === "production" && !sentryAuthToken) {
    try {
      // Simple dynamic import to get the token retrieval function
      // This is a workaround since we can't import from the src directly
      const response = await fetch(
        "https://predtpiopoxrnijtdclt.supabase.co/functions/v1/get-sentry-token", 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        sentryAuthToken = data.token;
        console.log("Successfully retrieved Sentry token for build");
      } else {
        console.error("Failed to retrieve Sentry token for build:", await response.text());
      }
    } catch (error) {
      console.error("Error retrieving Sentry token for build:", error);
    }
  }
  
  return {
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
        // Use token from environment or the one we retrieved
        authToken: sentryAuthToken,
        telemetry: false,
        silent: false, // Set to false to see debug information during build
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
  };
});
