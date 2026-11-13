import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

// The only place pages read the session. Reads cookies: call it inside <Suspense>.

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  memberSince: number;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  // getUser() checks the token with Supabase (never trust getSession() on the server)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const email = user.email ?? "";
  const metaName: unknown = user.user_metadata?.full_name;
  const fullName = typeof metaName === "string" ? metaName.trim() : "";

  return {
    id: user.id,
    email,
    fullName,
    firstName: fullName.split(/\s+/)[0] || email.split("@")[0],
    memberSince: new Date(user.created_at).getUTCFullYear(),
  };
}

/** For account pages: signed-out visitors go to the "Identify Yourself" page */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/identify");
  return user;
}
