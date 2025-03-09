
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    
    // Create a Supabase client using the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const {
      source,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests
    } = await req.json();

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

    // Format the prompt for Gemini
    const prompt = `
    Create a detailed travel plan with the following information:
    - Traveling from: ${source}
    - Destination: ${destination}
    - Travel dates: ${startDate} to ${endDate}
    - Budget: $${budget}
    - Number of travelers: ${travelers}
    ${interests ? `- Interests/preferences: ${interests}` : ''}

    Please provide a comprehensive travel plan that includes:
    1. Suggested flights from ${source} to ${destination} (with estimated prices)
    2. Recommended hotels or accommodations (with price ranges)
    3. Must-visit attractions and activities
    4. Food and restaurant recommendations
    5. Transportation options within ${destination}
    6. A day-by-day itinerary
    7. Budget breakdown for the entire trip
    8. Travel tips specific to ${destination}

    Format your response as a JSON object with the following structure:
    {
      "summary": "Brief overview of the trip plan",
      "flights": [{"airline": "...", "price": "...", "departure": "...", "arrival": "..."}],
      "accommodations": [{"name": "...", "location": "...", "pricePerNight": "...", "totalCost": "..."}],
      "attractions": [{"name": "...", "description": "...", "estimatedCost": "..."}],
      "restaurants": [{"name": "...", "cuisine": "...", "priceRange": "..."}],
      "transportation": [{"type": "...", "cost": "..."}],
      "itinerary": [{"day": 1, "activities": ["...", "..."], "meals": ["...", "..."], "notes": "..."}],
      "budgetBreakdown": {"flights": "...", "accommodations": "...", "food": "...", "activities": "...", "transportation": "...", "total": "..."},
      "tips": ["...", "..."]
    }
    `;

    if (!googleApiKey) {
      console.error("Missing GOOGLE_AI_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // Extract the response text from Gemini
    let aiResponse;
    try {
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const responseText = data.candidates[0].content.parts[0].text;
        
        // Parse the JSON response
        const startJson = responseText.indexOf("{");
        const endJson = responseText.lastIndexOf("}") + 1;
        
        if (startJson >= 0 && endJson > startJson) {
          const jsonStr = responseText.substring(startJson, endJson);
          aiResponse = JSON.parse(jsonStr);
        } else {
          // Fallback if JSON parsing fails
          aiResponse = { summary: responseText };
        }
      } else {
        console.error("Unexpected API response structure:", data);
        aiResponse = { error: "Failed to parse API response" };
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
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
