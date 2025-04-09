
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateUser } from "./auth-utils.ts";
import { buildTripPlanPrompt, parseAIResponse } from "./prompt-builder.ts";

const googleApiKey = Deno.env.get("GOOGLE_AI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const { user, supabase } = await authenticateUser(
      req.headers.get("Authorization"),
      supabaseUrl,
      supabaseServiceKey
    );
    
    console.log("Authenticated user:", user.id);

    const requestBody = await req.json();
    const {
      source,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests
    } = requestBody;

    // Validate required inputs
    if (!source || !destination || !startDate || !endDate || !budget || !travelers) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating trip plan with inputs:", {
      source, destination, startDate, endDate, budget, travelers, interests
    });

    if (!googleApiKey) {
      console.error("Missing GOOGLE_AI_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the prompt
    const prompt = buildTripPlanPrompt({
      source,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests
    });

    // Call the Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": googleApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    const data = await response.json();
    console.log("Received response from Gemini API");

    // Extract and parse the response
    let aiResponse;
    try {
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const responseText = data.candidates[0].content.parts[0].text;
        aiResponse = parseAIResponse(responseText, data);
      } else {
        console.error("Unexpected API response structure:", data);
        aiResponse = { error: "Failed to parse API response" };
      }
    } catch (error) {
      console.error("Error processing Gemini response:", error);
      aiResponse = { error: "Failed to parse Gemini response", rawResponse: data };
    }

    // Store the trip plan in the database
    const { data: tripPlan, error: insertError } = await supabase
      .from("trip_plans")
      .insert({
        user_id: user.id,
        source,
        destination,
        start_date: startDate,
        end_date: endDate,
        budget,
        travelers,
        interests: interests || null,
        ai_response: aiResponse
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting trip plan:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save trip plan", details: insertError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ tripPlan }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-trip-plan function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
