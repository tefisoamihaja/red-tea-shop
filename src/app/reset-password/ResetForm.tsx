"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { TextField } from "@/components/ui/TextField";

export function ResetForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    requestPasswordReset,
    {},
  );
  const sent = Boolean(state.message);

  return (
    <form action={formAction} className="flex w-full flex-col items-center gap-16 pt-4">
      {sent ? (
        <p role="status" className="font-display text-2xl tracking-wider uppercase">
          {state.message}
        </p>
      ) : (
        <TextField
          label="Email address"
          size="lg"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="email@domain.com"
          defaultValue={state.values?.email}
          required
          className="w-full max-w-160"
        />
      )}

      <FormAlert>{state.error}</FormAlert>

      <div className="flex flex-col items-center gap-8">
        {!sent && (
          <Button type="submit" size="wide" disabled={pending}>
            {pending ? "Sending…" : "Reset Password"}
          </Button>
        )}
        <Link
          href="/sign-in"
          className="text-2xs tracking-ultra uppercase opacity-50 transition-opacity duration-250 ease-out hover:opacity-100"
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
}
