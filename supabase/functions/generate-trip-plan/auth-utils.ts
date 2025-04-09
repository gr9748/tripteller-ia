
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export async function authenticateUser(
  authHeader: string | null,
  supabaseUrl: string,
  supabaseServiceKey: string
) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.split("Bearer ")[1];
  console.log("Received token:", token.substring(0, 10) + "...");
  
  // Create a Supabase client using the service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Verify the token and get the user
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data || !data.user) {
    console.error("Authentication error:", error);
    throw new Error("Unauthorized");
  }
  
  return { user: data.user, supabase };
}
