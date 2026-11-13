"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { MAX_QUANTITY } from "@/lib/cart";
import type { CartLine, Product } from "@/types";

const STORAGE_KEY = "xay-cart";

type CartState = { lines: CartLine[]; hydrated: boolean };

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; items: { product: Product; quantity: number }[] }
  | { type: "setQuantity"; slug: string; quantity: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

function clampQuantity(quantity: number) {
  return Math.min(MAX_QUANTITY, Math.max(0, Math.floor(quantity)));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };
    case "add": {
      let lines = state.lines;
      for (const { product, quantity } of action.items) {
        const amount = clampQuantity(quantity);
        if (amount === 0) continue;
        const { slug, name, origin, price, image } = product;
        lines = lines.some((line) => line.slug === slug)
          ? lines.map((line) =>
              line.slug === slug ? { ...line, quantity: clampQuantity(line.quantity + amount) } : line,
            )
          : [...lines, { slug, name, origin, price, image, quantity: amount }];
      }
      return { ...state, lines };
    }
    case "setQuantity": {
      const quantity = clampQuantity(action.quantity);
      const lines =
        quantity === 0
          ? state.lines.filter((line) => line.slug !== action.slug)
          : state.lines.map((line) => (line.slug === action.slug ? { ...line, quantity } : line));
      return { ...state, lines };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((line) => line.slug !== action.slug) };
    case "clear":
      return { ...state, lines: [] };
  }
}

// Ignore anything in localStorage that does not look like a cart line
function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.origin === "string" &&
    typeof line.image === "string" &&
    typeof line.price === "number" &&
    typeof line.quantity === "number" &&
    line.quantity > 0
  );
}

function readStoredCart(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isCartLine)
      .map((line) => ({ ...line, quantity: clampQuantity(line.quantity) }));
  } catch {
    return [];
  }
}

type CartContextValue = {
  lines: CartLine[];
  /** False until the saved cart has been read from the browser (first render) */
  ready: boolean;
  /** Total number of items (sum of quantities) */
  count: number;
  /** Sum of price × quantity, in euros */
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** Adds one unit and opens the bag */
  addItem: (product: Product) => void;
  /** Adds several products at once (e.g. "Reorder") and opens the bag */
  addItems: (items: { product: Product; quantity: number }[]) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [], hydrated: false });
  const [isOpen, setIsOpen] = useState(false);

  // Load after the first render (the server always renders an empty cart), then follow other tabs
  useEffect(() => {
    dispatch({ type: "hydrate", lines: readStoredCart() });
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) dispatch({ type: "hydrate", lines: readStoredCart() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage full or blocked (private mode): the cart still works for this visit
    }
  }, [state]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const addItems = useCallback((items: { product: Product; quantity: number }[]) => {
    dispatch({ type: "add", items });
    setIsOpen(true);
  }, []);
  const addItem = useCallback((product: Product) => addItems([{ product, quantity: 1 }]), [addItems]);
  const setQuantity = useCallback(
    (slug: string, quantity: number) => dispatch({ type: "setQuantity", slug, quantity }),
    [],
  );
  const removeItem = useCallback((slug: string) => dispatch({ type: "remove", slug }), []);
  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      ready: state.hydrated,
      count: state.lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: state.lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      isOpen,
      openCart,
      closeCart,
      addItem,
      addItems,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [state.lines, state.hydrated, isOpen, openCart, closeCart, addItem, addItems, setQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
