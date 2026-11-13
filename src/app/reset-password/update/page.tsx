import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { UpdatePasswordForm } from "./UpdatePasswordForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "New Password — XAY Teahouse",
};

export default function UpdatePasswordPage() {
  return (
    <div className="flex justify-center px-6 pt-40 pb-32 md:px-16 xl:pt-83 xl:pb-56">
      <Reveal className="flex w-full max-w-240 flex-col items-center gap-12 pb-4 text-center md:gap-16">
        <h1 className="heading text-8xl md:text-10xl xl:text-11xl">Reset</h1>
        {/* Reads cookies: needs Suspense */}
        <Suspense fallback={<div className="h-80" aria-busy="true" />}>
          <UpdatePasswordContent />
        </Suspense>
      </Reveal>
    </div>
  );
}

async function UpdatePasswordContent() {
  const user = await getCurrentUser();

  // Opened without a valid recovery link
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-12">
        <p className="text-sm tracking-ultra uppercase opacity-80">
          This recovery link has expired. Please request a new one.
        </p>
        <Link
          href="/reset-password"
          className="text-2xs tracking-ultra uppercase opacity-50 transition-opacity duration-250 ease-out hover:opacity-100"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm tracking-ultra uppercase opacity-80">Choose a new password</p>
      <UpdatePasswordForm />
    </>
  );
}
