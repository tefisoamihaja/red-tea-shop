import "server-only";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

// Server only: the table has no public access, so it goes through the secret key.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Adds the email (already subscribed = success). Throws if the list is unreachable. */
export async function subscribe(email: string): Promise<void> {
  const { error } = await createAdminClient()
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  if (error) throw new Error(`newsletter subscribe failed: ${error.code} ${error.message}`);
}

/** null when unknown (list not set up yet) */
export async function isSubscribed(email: string): Promise<boolean | null> {
  if (!isSupabaseAdminConfigured || !email) return null;
  const { data, error } = await createAdminClient()
    .from("newsletter_subscribers")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) {
    console.error("newsletter lookup failed:", error.code, error.message);
    return null;
  }
  return data !== null;
}
