
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateUser } from "./auth-utils.ts";
import { buildTripPlanPrompt, parseAIResponse } from "./prompt-builder.ts";

const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
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

    // Validate budget specifically
    if (budget <= 0) {
      return new Response(
        JSON.stringify({ error: "Budget must be greater than 0" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating trip plan with inputs:", {
      source, destination, startDate, endDate, budget, travelers, interests
    });

    if (!lovableApiKey) {
      console.error("Missing LOVABLE_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the prompt with emphasis on budget constraint
    const prompt = buildTripPlanPrompt({
      source,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests
    });

    // Call Lovable AI Gateway (using OpenAI-compatible format)
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Received response from Lovable AI");

    // Extract and parse the response (OpenAI format)
    let aiResponse;
    try {
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const responseText = data.choices[0].message.content;
        aiResponse = parseAIResponse(responseText, data);
        
        // Validate budget compliance
        if (aiResponse.budgetBreakdown && aiResponse.budgetBreakdown.total) {
          const totalCost = parseCurrencyToNumber(aiResponse.budgetBreakdown.total);
          console.log(`Budget check: Generated plan total cost: ${totalCost}, User budget: ${budget}`);
          
          if (totalCost > budget * 1.1) { // Allow 10% flexibility
            console.log("Budget exceeded, adjusting plan to fit budget");
            adjustPlanToFitBudget(aiResponse, budget);
          }
        }
      } else {
        console.error("Unexpected API response structure:", data);
        aiResponse = { error: "Failed to parse API response" };
      }
    } catch (error) {
      console.error("Error processing AI response:", error);
      aiResponse = { error: "Failed to parse AI response", rawResponse: data };
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

// Helper function to parse currency string to number
function parseCurrencyToNumber(currencyStr: string): number {
  if (!currencyStr) return 0;
  // Remove all non-numeric characters except decimal point
  const numericString = currencyStr.toString().replace(/[^\d.]/g, '');
  return parseFloat(numericString) || 0;
}

// Function to adjust plan to fit within budget
function adjustPlanToFitBudget(aiResponse: any, budget: number) {
  if (!aiResponse || !aiResponse.budgetBreakdown) return;
  
  const totalCost = parseCurrencyToNumber(aiResponse.budgetBreakdown.total);
  const scaleFactor = budget / totalCost;
  
  console.log(`Adjusting plan with scale factor: ${scaleFactor}`);
  
  // Adjust budget breakdown
  Object.keys(aiResponse.budgetBreakdown).forEach(key => {
    if (key !== 'total' && typeof aiResponse.budgetBreakdown[key] === 'string') {
      const value = parseCurrencyToNumber(aiResponse.budgetBreakdown[key]);
      const adjustedValue = Math.round(value * scaleFactor);
      aiResponse.budgetBreakdown[key] = `₹${adjustedValue.toLocaleString('en-IN')}`;
    }
  });
  
  // Recalculate total
  aiResponse.budgetBreakdown.total = `₹${budget.toLocaleString('en-IN')}`;
  
  // Adjust other cost items
  adjustCostsInCategory(aiResponse, 'accommodations', ['pricePerNight', 'totalCost'], scaleFactor);
  adjustCostsInCategory(aiResponse, 'flights', ['price'], scaleFactor);
  adjustCostsInCategory(aiResponse, 'attractions', ['estimatedCost'], scaleFactor);
  adjustCostsInCategory(aiResponse, 'activities', ['cost'], scaleFactor);
  adjustCostsInCategory(aiResponse, 'transportation', ['cost', 'costPerDay', 'totalCost'], scaleFactor);
  
  // Update summary to mention budget adjustment
  if (aiResponse.summary) {
    aiResponse.summary = `${aiResponse.summary}\n\nNote: This plan has been optimized to fit within your budget of ₹${budget.toLocaleString('en-IN')}.`;
  }
}

// Helper function to adjust costs in a specific category
function adjustCostsInCategory(aiResponse: any, category: string, costFields: string[], scaleFactor: number) {
  if (Array.isArray(aiResponse[category])) {
    aiResponse[category].forEach((item: any) => {
      costFields.forEach(field => {
        if (item[field]) {
          const cost = parseCurrencyToNumber(item[field]);
          item[field] = `₹${Math.round(cost * scaleFactor).toLocaleString('en-IN')}`;
        }
      });
    });
  }
}
