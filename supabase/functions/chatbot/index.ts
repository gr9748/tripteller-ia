
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
    
    // Add system prompt with enhanced travel knowledge
    formattedMessages.push({
      role: "model",
      parts: [{ text: "You are Odyssique, an expert travel assistant with comprehensive knowledge of hotels, restaurants, and tourist attractions worldwide. You provide detailed information about accommodations including luxury resorts, boutique hotels, and budget-friendly options. You know about restaurants across all cuisines, price points, and cultural specialties. You can recommend tourist attractions including historical sites, natural wonders, museums, local experiences, and hidden gems across the globe. Keep your responses friendly, personalized, and informative while maintaining a sophisticated tone. Your goal is to help users plan the perfect trip tailored to their preferences." }]
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
