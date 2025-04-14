
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

    if (!googleApiKey) {
      console.error("Missing GOOGLE_AI_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the conversation history for Gemini
    const formattedMessages = [];
    
    // Add system prompt with enhanced travel knowledge and fun personality
    formattedMessages.push({
      role: "model",
      parts: [{ text: `You are the TripTales AI assistant, a travel companion for the TripTales travel planning platform.

PERSONALITY:
1. Be friendly, enthusiastic, and knowledgeable about travel.
2. Use occasional travel-related emojis like ✈️, 🏖️, 🧳, 🗺️, 🌄, 🚆 to add character.
3. Be concise but engaging - keep your energy high!
4. Show genuine excitement about travel destinations.
5. Address users as "traveler" occasionally.

IMPORTANT FORMATTING INSTRUCTIONS:
1. DO NOT use asterisks (*) for emphasis or formatting.
2. Use clear sentence structure.
3. For important information, use phrases like "Note:" or "Pro tip:".
4. Keep responses informative but conversational.
5. When mentioning prices, always use Indian Rupees (₹).
6. Try to respond in 2-3 sentences when possible.
7. Occasionally add a fun travel fact if relevant to the conversation.

Answer questions directly and helpfully, but with enthusiasm. If users ask about website navigation, explain the relevant feature concisely.` }]
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

    // Call the Gemini API with a good balance of creativity
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": googleApiKey,
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7, // More creative responses
          maxOutputTokens: 500, 
        },
      }),
    });

    const data = await response.json();

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
