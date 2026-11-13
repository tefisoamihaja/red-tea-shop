import type { Metadata } from "next";
import { AuthSplit } from "@/components/layout/AuthSplit";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In — XAY Teahouse",
};

export default function SignInPage() {
  return (
    <AuthSplit
      title={
        <>
          Welcome
          <br />
          Back
        </>
      }
      intro="Sign in to access your saved blends and order history."
      cardTitle="Sign In"
      cardSubtitle="Return to the ceremony"
    >
      <SignInForm />
    </AuthSplit>
  );
}
