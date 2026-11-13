// The publishable key is public by design: RLS protects the data.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until the keys are set: auth then answers "not configured" instead of crashing */
export const isSupabaseConfigured = supabaseUrl !== "" && supabaseKey !== "";
