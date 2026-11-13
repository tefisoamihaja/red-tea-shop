"use client";

import { useActionState } from "react";
import { updatePassword, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { TextField } from "@/components/ui/TextField";

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(updatePassword, {});
  const busy = useAuthRedirect(state.redirectTo) || pending;

  return (
    <form action={formAction} className="flex w-full flex-col items-center gap-12 pt-4">
      <TextField
        label="New password"
        size="lg"
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder="New password"
        minLength={8}
        required
        className="w-full max-w-160"
      />
      <TextField
        label="Confirm new password"
        size="lg"
        type="password"
        name="confirm"
        autoComplete="new-password"
        placeholder="Confirm"
        minLength={8}
        required
        className="w-full max-w-160"
      />

      <FormAlert>{state.error}</FormAlert>

      <Button type="submit" size="wide" disabled={busy}>
        {busy ? "Saving…" : "Save Password"}
      </Button>
    </form>
  );
}
