import { cn } from "@/lib/cn";

export function FormAlert({ children, className }: { children?: string; className?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className={cn("rounded-sm bg-blush-50 px-4 py-3 text-sm", className)}>
      {children}
    </p>
  );
}
