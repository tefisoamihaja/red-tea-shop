"use client";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";

type ReorderButtonProps = {
  orderNumber: string;
  /** Products still in the catalog (current price), with the ordered quantity */
  items: { product: Product; quantity: number }[];
  /** Number of order lines no longer sold (skipped) */
  unavailable: number;
};

export function ReorderButton({ orderNumber, items, unavailable }: ReorderButtonProps) {
  const { addItems } = useCart();
  const none = items.length === 0;
  const note =
    unavailable > 0 && !none
      ? ` (${unavailable} item${unavailable > 1 ? "s" : ""} no longer available)`
      : "";

  return (
    <Button
      size="sm"
      disabled={none}
      onClick={() => addItems(items)}
      aria-label={none ? `Order ${orderNumber}: no longer available` : `Reorder ${orderNumber}${note}`}
      title={none ? "These products are no longer available" : note.trim() || undefined}
    >
      Reorder
    </Button>
  );
}
