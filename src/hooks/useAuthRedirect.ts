"use client";

import { useEffect } from "react";

// After signing in, load the next page for real instead of letting the Server Action
// render it in the same response: with a slow round trip to Supabase that response
// was dropped and the form stayed on screen, so people signed in twice.
// Returns true while leaving, to keep the button busy.
export function useAuthRedirect(redirectTo: string | undefined) {
  useEffect(() => {
    if (redirectTo) window.location.assign(redirectTo);
  }, [redirectTo]);
  return Boolean(redirectTo);
}
