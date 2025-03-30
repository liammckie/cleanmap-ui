
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Always try to get the Sentry token, regardless of mode
  let sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
  
  // Only try to fetch token if it isn't already set from environment
  if (!sentryAuthToken) {
    try {
      // Direct fetch to the edge function
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn("Missing Supabase credentials - cannot fetch Sentry token");
      } else {
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
        
        if (response.ok) {
          const responseData = await response.json();
          sentryAuthToken = responseData.token;
          console.log("Successfully retrieved Sentry token for build");
        } else {
          console.error("Failed to retrieve Sentry token for build:", await response.text());
        }
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
      // Use Sentry plugin in all environments if token is available
      sentryAuthToken && sentryVitePlugin({
        org: "liammckie",
        project: "javascript-react",
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
