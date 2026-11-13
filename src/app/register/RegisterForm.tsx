"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { TextField } from "@/components/ui/TextField";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signUp, {});

  if (state.message) {
    return (
      <p role="status" className="font-display text-2xl tracking-wider uppercase">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <TextField
        label="Full Name"
        name="name"
        autoComplete="name"
        placeholder="Alexander Xay"
        maxLength={100}
        defaultValue={state.values?.name}
        required
      />
      <TextField
        label="Email Address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="hello@domain.com"
        defaultValue={state.values?.email}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        minLength={8}
        required
      />

      <FormAlert>{state.error}</FormAlert>

      <div className="flex flex-col gap-8 pt-8">
        <Button type="submit" variant="solid" className="w-full" disabled={pending}>
          {pending ? "Joining…" : "Join XAY"}
        </Button>
        <p className="flex items-center justify-between">
          <span className="label opacity-60">Already a member?</span>
          <Link
            href="/sign-in"
            className="label font-bold transition-opacity duration-250 ease-out hover:opacity-60"
          >
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}
