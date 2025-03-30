
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
    // Get the authorization header
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      console.error("Missing Authorization header");
      return new Response(
        JSON.stringify({ 
          error: "Missing Authorization header",
          message: "Please provide an Authorization header with Bearer token"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Get the Sentry auth token from secrets
    const sentryAuthToken = Deno.env.get("SENTRY_AUTH_TOKEN");
    console.log("Attempting to retrieve Sentry token");

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

    console.log("Sentry token retrieved successfully with length:", sentryAuthToken.length);
    
    // For security, mask the token in logs
    const maskedToken = sentryAuthToken.substring(0, 4) + "..." + sentryAuthToken.substring(sentryAuthToken.length - 4);
    console.log("Token begins with:", maskedToken);
    
    return new Response(
      JSON.stringify({ 
        token: sentryAuthToken,
        timestamp: new Date().toISOString(),
        message: "Token retrieved successfully"
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
        stack: error.stack,
        type: error.constructor.name
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
