import { EmptyState } from "@/components/ui/EmptyState";

export function OrdersNotice({ kind }: { kind: "empty" | "error" }) {
  return kind === "empty" ? (
    <EmptyState>No orders yet. Your first ceremony awaits.</EmptyState>
  ) : (
    <EmptyState action={null}>Your orders are unavailable right now. Please try again later.</EmptyState>
  );
}
