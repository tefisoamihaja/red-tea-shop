import type { Metadata } from "next";
import { MessagePage } from "@/components/layout/MessagePage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Link Expired — XAY Teahouse",
};

export default function AuthErrorPage() {
  return (
    <MessagePage>
      <h1 className="heading text-6xl md:text-8xl xl:text-11xl">Expired</h1>
      <p className="text-sm tracking-ultra uppercase opacity-80">
        This link is invalid or has already been used. Links from our emails only work once, in
        the browser where you asked for them.
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        <Button href="/reset-password">Request a New Link</Button>
        <Button href="/sign-in" variant="solid" size="md">
          Sign In
        </Button>
      </div>
    </MessagePage>
  );
}
