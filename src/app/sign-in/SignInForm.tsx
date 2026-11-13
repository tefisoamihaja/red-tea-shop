"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { TextField } from "@/components/ui/TextField";

const textLink = "label font-bold transition-opacity duration-250 ease-out hover:opacity-60";

export function SignInForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signIn, {});
  const busy = useAuthRedirect(state.redirectTo) || pending;
  return (
    <form
      // Read ?next= on submit so the page can stay static
      action={(formData) => {
        formData.set("next", new URLSearchParams(window.location.search).get("next") ?? "");
        formAction(formData);
      }}
      className="flex flex-col gap-8"
    >
      <TextField
        label="Email Address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="hello@domain.com"
        defaultValue={state.values?.email}
        required
      />
      <div className="flex flex-col gap-4">
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
        <Link
          href="/reset-password"
          className="label self-end opacity-60 transition-opacity duration-250 ease-out hover:opacity-100"
        >
          Forgot password?
        </Link>
      </div>

      <FormAlert>{state.error}</FormAlert>

      <div className="flex flex-col gap-8 pt-8">
        <Button type="submit" variant="solid" className="w-full" disabled={busy}>
          {busy ? "Signing In…" : "Sign In"}
        </Button>
        <p className="flex items-center justify-between">
          <span className="label opacity-60">New to XAY?</span>
          <Link href="/register" className={textLink}>
            Create Account
          </Link>
        </p>
      </div>
    </form>
  );
}
