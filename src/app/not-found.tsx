import type { Metadata } from "next";
import { MessagePage } from "@/components/layout/MessagePage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found — XAY Teahouse",
};

export default function NotFound() {
  return (
    <MessagePage>
      <h1 className="heading text-10xl xl:text-11xl">404</h1>
      <p className="text-sm tracking-ultra uppercase opacity-80">
        This page has steeped a little too long. It may have moved, or never existed.
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        <Button href="/">Back Home</Button>
        <Button href="/shop" variant="solid" size="md">
          Explore Collection
        </Button>
      </div>
    </MessagePage>
  );
}
