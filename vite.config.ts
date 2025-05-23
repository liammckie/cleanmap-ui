
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Define our own component tagger plugin
const componentTagger = () => {
  return {
    name: 'component-tagger',
    apply: 'serve',
    transform(code: string, id: string) {
      if (id.endsWith('.tsx') && id.includes('/components/')) {
        // Simple component tagging implementation
        return code.replace(
          /export\s+default\s+([A-Za-z0-9_]+);/g,
          'export default $1; // Component: $1'
        );
      }
      return null;
    }
  };
};

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
        console.log(`Fetching Sentry token from ${supabaseUrl}/functions/v1/get-sentry-token`);
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
          const responseData = await response.json() as { token?: string };
          if (responseData && responseData.token) {
            sentryAuthToken = responseData.token;
            console.log("Successfully retrieved Sentry token for build");
          }
        } else {
          console.error("Failed to retrieve Sentry token for build:", await response.text());
        }
      }
    } catch (error) {
      console.error("Error retrieving Sentry token for build:", error);
    }
  }
  
  // Verify token is available for Sentry plugin
  const sentryPluginEnabled = !!sentryAuthToken;
  if (sentryPluginEnabled) {
    console.log("Sentry plugin will be enabled - token available");
  } else {
    console.warn("Sentry plugin will be disabled - no authentication token available");
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
      // Add the specific host to allowed hosts
      allowedHosts: [
        "22fe514c-de46-4c4f-bd43-e9833b3d4e50.lovableproject.com"
      ],
    },
    plugins: [
      react(),
      // Enable component tagger in development mode
      mode === 'development' && componentTagger(),
      // Use Sentry plugin in all environments if token is available
      sentryPluginEnabled && sentryVitePlugin({
        org: "liammckie",
        project: "javascript-react",
        authToken: sentryAuthToken,
        release: {
          name: `cleanmap-ui@${process.env.GITHUB_SHA?.slice(0, 7) || "dev"}`,
        },
        sourcemaps: {
          assets: "./dist/**", 
        },
        url: "https://sentry.io/",
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
