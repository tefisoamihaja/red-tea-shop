"use server";

import { redirect } from "next/navigation";
import { safePath } from "@/lib/safe-path";
import { siteUrl } from "@/lib/site-url";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

// Auth forms, used with useActionState. Every input is validated again here.

export type AuthFormState = {
  error?: string;
  /** Success message shown instead of the form */
  message?: string;
  /** Refilled after an error (never the password) */
  values?: { name?: string; email?: string };
};

const NOT_CONFIGURED = "Sign-in is not available yet. Please try again later.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8; // also set as minLength in the forms

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// Passwords are not trimmed: spaces are allowed
function password(formData: FormData, name = "password") {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function isRateLimited(error: { code?: string; status?: number }) {
  return error.status === 429 || error.code?.startsWith("over_") === true;
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, "email").toLowerCase();
  const pass = password(formData);
  const values = { email };

  if (!EMAIL_PATTERN.test(email) || !pass) {
    return { error: "Enter your email address and password.", values };
  }
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED, values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: pass });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Please confirm your email first: check your inbox.", values };
    }
    if (isRateLimited(error)) return { error: "Too many attempts. Please wait a moment.", values };
    // Don't reveal whether the email exists
    return { error: "Incorrect email or password.", values };
  }

  redirect(safePath(formData.get("next")));
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = field(formData, "name").slice(0, 100);
  const email = field(formData, "email").toLowerCase();
  const pass = password(formData);
  const values = { name, email };

  if (!name) return { error: "Enter your full name.", values };
  if (!EMAIL_PATTERN.test(email)) return { error: "Enter a valid email address.", values };
  if (pass.length < MIN_PASSWORD_LENGTH) {
    return { error: `Your password needs at least ${MIN_PASSWORD_LENGTH} characters.`, values };
  }
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED, values };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${await siteUrl()}/auth/confirm?next=/account`,
    },
  });

  if (error) {
    if (error.code === "weak_password") {
      return { error: "This password is too weak. Try a longer one.", values };
    }
    if (error.code === "user_already_exists") {
      return { error: "An account already exists for this email. Sign in instead.", values };
    }
    if (error.code === "email_address_invalid") return { error: "Enter a valid email address.", values };
    // Supabase's free email service only sends to project members
    if (error.code === "email_address_not_authorized") {
      return { error: "We cannot send a confirmation email to this address yet.", values };
    }
    if (error.code === "signup_disabled") return { error: "New accounts are closed for now.", values };
    if (isRateLimited(error)) return { error: "Too many attempts. Please wait a moment.", values };
    console.error("signUp failed:", error.code ?? error.status, error.message);
    return { error: "We could not create your account. Please try again.", values };
  }

  // Email confirmation is off: the user is already signed in
  if (data.session) redirect("/account");

  return { message: "Welcome to the inner circle. Check your inbox to confirm your email." };
}

export async function requestPasswordReset(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = field(formData, "email").toLowerCase();
  const values = { email };

  if (!EMAIL_PATTERN.test(email)) return { error: "Enter a valid email address.", values };
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED, values };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteUrl()}/auth/confirm?next=/reset-password/update`,
  });

  if (error && isRateLimited(error)) {
    return { error: "Too many requests. Please wait a few minutes.", values };
  }
  // Same answer whether the account exists or not
  return { message: "If an account exists for this email, a recovery link is on its way." };
}

export async function updatePassword(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const pass = password(formData);
  const confirm = password(formData, "confirm");

  if (pass.length < MIN_PASSWORD_LENGTH) {
    return { error: `Your password needs at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (pass !== confirm) return { error: "The two passwords do not match." };
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "This recovery link has expired. Please request a new one." };

  const { error } = await supabase.auth.updateUser({ password: pass });
  if (error) {
    if (error.code === "same_password") {
      return { error: "Choose a password different from your current one." };
    }
    if (error.code === "weak_password") return { error: "This password is too weak. Try a longer one." };
    return { error: "We could not update your password. Please try again." };
  }

  redirect("/account");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
