import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

// Centered message page (404, expired link, thank you).
export function MessagePage({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center px-6 pt-40 pb-32 md:px-16 xl:pt-56 xl:pb-56">
      <Reveal className="flex max-w-240 flex-col items-center gap-12 text-center">{children}</Reveal>
    </div>
  );
}
