import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCurrentUser } from "@/lib/auth";
import { getProducts } from "@/lib/products";
import { CheckoutView } from "./CheckoutView";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Checkout — XAY Teahouse",
};

export default async function CheckoutPage() {
  // The bag keeps old prices: show the ones Stripe will charge
  const catalog = await getProducts();

  return (
    <div className="flex flex-col gap-16 px-6 pt-32 pb-40 md:px-10 xl:px-16 xl:pt-48">
      <PageHeader title="Checkout" subtitle="Review your selection">
        {/* Reads cookies: needs Suspense */}
        <Suspense fallback={<p className="label invisible">…</p>}>
          <AccountHint />
        </Suspense>
      </PageHeader>
      <Reveal delay={0.15}>
        <CheckoutView catalog={catalog} />
      </Reveal>
    </div>
  );
}

async function AccountHint() {
  const user = await getCurrentUser();
  if (user) {
    return <p className="label opacity-60">Signed in as {user.email}</p>;
  }
  return (
    <p className="label flex flex-wrap gap-x-3 gap-y-2">
      <span className="opacity-60">Checking out as a guest.</span>
      <Link href="/sign-in?next=/checkout" className="font-bold underline underline-offset-4 hover:opacity-60">
        Sign in to save this order to your account
      </Link>
    </p>
  );
}
