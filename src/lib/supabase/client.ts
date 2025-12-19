import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for client-side database queries
 * Note: This is only for database operations, not authentication
 * Authentication is now handled by Clerk
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
