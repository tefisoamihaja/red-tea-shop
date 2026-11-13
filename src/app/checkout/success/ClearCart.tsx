"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";

// Empties the bag once the order is confirmed.
export function ClearCart() {
  const { ready, clearCart } = useCart();

  useEffect(() => {
    // Wait for the saved cart, otherwise it would come back right after
    if (ready) clearCart();
  }, [ready, clearCart]);

  return null;
}
