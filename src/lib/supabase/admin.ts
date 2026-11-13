import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

// Secret key client: bypasses RLS. Server only, and only once everything has been checked.

const secretKey = process.env.SUPABASE_SECRET_KEY ?? "";

export const isSupabaseAdminConfigured = supabaseUrl !== "" && secretKey !== "";

export function createAdminClient() {
  if (!isSupabaseAdminConfigured) throw new Error("SUPABASE_SECRET_KEY is not set (see .env.example)");
  return createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
