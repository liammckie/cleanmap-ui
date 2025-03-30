
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the Sentry auth token from secrets
    const sentryAuthToken = Deno.env.get("SENTRY_AUTH_TOKEN");

    if (!sentryAuthToken) {
      console.error("SENTRY_AUTH_TOKEN not found in Supabase secrets");
      return new Response(
        JSON.stringify({ 
          error: "SENTRY_AUTH_TOKEN not found in secrets",
          message: "Please add the SENTRY_AUTH_TOKEN to your Supabase secrets"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Sentry token retrieved successfully");
    
    return new Response(
      JSON.stringify({ 
        token: sentryAuthToken,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving Sentry token:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
