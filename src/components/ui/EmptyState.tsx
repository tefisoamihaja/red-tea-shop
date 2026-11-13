import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  children,
  action = { label: "Explore Collection", href: "/shop" },
}: {
  children: ReactNode;
  /** Button under the message; null = no button */
  action?: { label: string; href: string } | null;
}) {
  return (
    <div className="flex flex-col items-start gap-8 border-y border-tea-500/10 py-12">
      <p className="label opacity-60">{children}</p>
      {action && (
        <Button href={action.href} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
