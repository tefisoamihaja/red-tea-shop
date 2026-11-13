"use server";

import { EMAIL_PATTERN, subscribe } from "@/lib/newsletter";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export type NewsletterState = { error?: string; done?: boolean; email?: string };

export async function joinNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { error: "Enter a valid email address.", email };
  }
  if (!isSupabaseAdminConfigured) {
    return { error: "The list is not open yet. Please try again later.", email };
  }

  try {
    await subscribe(email);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return { error: "We could not add you to the list. Please try again.", email };
  }
  // Same answer whether the email was already on the list or not
  return { done: true };
}
