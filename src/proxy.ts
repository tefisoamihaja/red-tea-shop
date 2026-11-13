import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Keeps the Supabase session fresh (Next 16 "proxy", formerly middleware).
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Every page and action, but not static files, images or the Stripe webhook
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|api/stripe/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
