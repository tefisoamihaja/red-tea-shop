"use client";

import { useActionState } from "react";
import { joinNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [state, formAction, pending] = useActionState<NewsletterState, FormData>(joinNewsletter, {});

  return (
    <section className="flex flex-col items-center rounded-panel bg-tea-500 px-6 py-24 text-center md:rounded-card md:px-10 md:py-32 xl:px-16 xl:py-40">
      <h2 className="heading pb-6 text-6xl text-paper-500 md:text-7xl xl:pb-8 xl:text-8xl">Join the List</h2>
      <p className="pb-12 text-sm tracking-ultra md:text-md xl:pb-20 text-white uppercase">
        Exclusive drops and ceremonial insights
      </p>

      {state.done ? (
        <p role="status" className="font-display text-2xl tracking-wider text-paper-500 md:text-4xl uppercase">
          Thank you — welcome to the circle.
        </p>
      ) : (
        <div className="flex w-full max-w-200 flex-col items-center gap-6">
          <form
            action={formAction}
            className="flex w-full items-center gap-4 border-b border-paper-500 pb-4"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={state.email}
              placeholder="email@domain.com"
              aria-invalid={state.error ? true : undefined}
              aria-describedby={state.error ? "newsletter-error" : undefined}
              className="min-w-0 flex-1 bg-transparent py-2 text-left font-display text-2xl tracking-wider md:text-input text-paper-500 uppercase outline-none placeholder:text-paper-500/80"
            />
            <Button variant="link" type="submit" disabled={pending}>
              {pending ? "Sending…" : "Submit"}
            </Button>
          </form>
          {state.error && (
            <p id="newsletter-error" role="alert" className="text-sm tracking-ultra text-white uppercase">
              {state.error}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
