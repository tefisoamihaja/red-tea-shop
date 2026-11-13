"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Product, WishlistItem } from "@/types";

const STORAGE_KEY = "xay-wishlist";

function isWishlistItem(value: unknown): value is WishlistItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.origin === "string" &&
    typeof item.image === "string" &&
    typeof item.price === "number"
  );
}

function readStoredWishlist(): WishlistItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isWishlistItem) : [];
  } catch {
    return [];
  }
}

type State = { items: WishlistItem[]; ready: boolean };
type Action =
  | { type: "hydrate"; items: WishlistItem[] }
  | { type: "toggle"; product: Product }
  | { type: "remove"; slug: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, ready: true };
    case "toggle": {
      if (state.items.some((item) => item.slug === action.product.slug)) {
        return { ...state, items: state.items.filter((item) => item.slug !== action.product.slug) };
      }
      const { slug, name, origin, price, image } = action.product;
      return { ...state, items: [...state.items, { slug, name, origin, price, image }] };
    }
    case "remove":
      return { ...state, items: state.items.filter((item) => item.slug !== action.slug) };
  }
}

type WishlistContextValue = {
  items: WishlistItem[];
  /** False until the saved list has been read from the browser (first render) */
  ready: boolean;
  has: (slug: string) => boolean;
  toggle: (product: Product) => void;
  remove: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [{ items, ready }, dispatch] = useReducer(reducer, { items: [], ready: false });

  // Load after the first render (the server renders an empty list) and follow other tabs
  useEffect(() => {
    dispatch({ type: "hydrate", items: readStoredWishlist() });
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) dispatch({ type: "hydrate", items: readStoredWishlist() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked (private mode): the list still works for this visit
    }
  }, [items, ready]);

  const has = useCallback((slug: string) => items.some((item) => item.slug === slug), [items]);
  const toggle = useCallback((product: Product) => dispatch({ type: "toggle", product }), []);
  const remove = useCallback((slug: string) => dispatch({ type: "remove", slug }), []);

  const value = useMemo(() => ({ items, ready, has, toggle, remove }), [items, ready, has, toggle, remove]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}
