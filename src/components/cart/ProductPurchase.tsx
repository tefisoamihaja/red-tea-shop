"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";
import { WishlistButton } from "./WishlistButton";

export function ProductPurchase({ product }: { product: Product }) {
  const { addItems } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-6">
        <QuantityStepper value={quantity} onChange={setQuantity} variant="pill" />

        <Button
          variant="solid"
          size="md"
          className="flex-1 sm:flex-none"
          onClick={() => {
            addItems([{ product, quantity }]);
            setQuantity(1);
          }}
        >
          Add to Bag — {formatPrice(product.price * quantity)}
        </Button>
      </div>

      <WishlistButton product={product} className="self-start" />
    </div>
  );
}
