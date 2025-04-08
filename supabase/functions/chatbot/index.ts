
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
    // Extract the request body
    const requestBody = await req.json();
    const { message, chatHistory } = requestBody;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Received chat message:", message);
    console.log("Chat history length:", chatHistory?.length || 0);

    if (!googleApiKey) {
      console.error("Missing GOOGLE_AI_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the conversation history for Gemini
    const formattedMessages = [];
    
    // Add system prompt with enhanced travel knowledge and website knowledge
    formattedMessages.push({
      role: "model",
      parts: [{ text: `You are Odyssique, an expert travel assistant with comprehensive knowledge of hotels, restaurants, and tourist attractions worldwide. 

ABOUT THIS WEBSITE:
This website is called Odyssique, a travel planning platform with the following features:
1. Trip Planner: Users can create personalized travel plans by entering their source, destination, dates, budget, and number of travelers.
2. Previous Plans: Users can view, use again, or delete their previously created travel plans.
3. Travel Chat: Users can chat with you (Odyssique AI) to get travel advice, suggestions, and answers to their queries.

WEBSITE NAVIGATION GUIDE:
- Home Page: Shows welcome information and options to create a new trip plan
- Trip Planner: Where users create new travel plans with AI assistance
- My Plans: Where users can view their previously created plans
- Profile: Where users can manage their account details
- Login/Signup: For user authentication

IMPORTANT FORMATTING INSTRUCTIONS:
1. DO NOT use asterisks (*) for emphasis or formatting.
2. Instead, use clear sentence structure and conversational tone.
3. For important information, start sentences with phrases like "Important:" or "Note:".
4. Use line breaks instead of bullet points when listing items.
5. Keep your responses conversational and friendly.
6. When mentioning prices, always use Indian Rupees (₹).

You provide detailed information about accommodations including luxury resorts, boutique hotels, and budget-friendly options. You know about all modes of transportation including flights, trains, buses, car rentals, taxis, ferries, and local transit options. You can recommend tourist attractions including historical sites, natural wonders, museums, local experiences, and hidden gems across the globe. All pricing is in Indian Rupees (₹).

If users ask about how to use the website or navigate features, provide clear instructions. For example, if they ask "How do I create a plan?", explain that they need to go to the Trip Planner and fill in details like destination, dates, budget, etc.

If users ask questions like "navigate this website" or "how do I use this site", explain all the main features of the website and how to access them.

Keep your responses friendly, personalized, and informative while maintaining a sophisticated tone. Your goal is to help users plan the perfect trip tailored to their preferences and help them navigate the Odyssique website efficiently.` }]
    });
    
    // Add conversation history if provided
    if (chatHistory && chatHistory.length > 0) {
      for (const chat of chatHistory) {
        if (chat.role === 'user') {
          formattedMessages.push({
            role: "user",
            parts: [{ text: chat.content }]
          });
        } else if (chat.role === 'assistant') {
          formattedMessages.push({
            role: "model",
            parts: [{ text: chat.content }]
          });
        }
      }
    }
    
    // Add current user message
    formattedMessages.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Call the Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": googleApiKey,
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    const data = await response.json();
    console.log("Received response from Gemini API");

    // Extract the response text from Gemini
    let responseText = "";
    try {
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        responseText = data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response structure:", data);
        return new Response(
          JSON.stringify({ error: "Failed to parse API response" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return new Response(
        JSON.stringify({ error: "Failed to parse Gemini response", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chatbot function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
