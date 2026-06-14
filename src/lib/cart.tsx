"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "./types";
import { lineTotal } from "./pricing";

// Cart is client-side ONLY until an order is placed (build spec §5). It never
// touches the server pre-checkout. Persisted to localStorage for refresh safety.

const STORAGE_KEY = "gsa.cart.v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // corrupt cart — start clean
    }
    setReady(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / unavailable — non-fatal
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, it) => n + it.qty, 0);
    const subtotal = items.reduce(
      (sum, it) => sum + lineTotal(it.retailPriceUsd, it.tiers, it.qty),
      0
    );

    return {
      items,
      count,
      subtotal,
      ready,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((p) => p.productId === item.productId);
          if (existing) {
            return prev.map((p) =>
              p.productId === item.productId
                ? { ...p, qty: p.qty + qty }
                : p
            );
          }
          return [...prev, { ...item, qty }];
        }),
      setQty: (productId, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => p.productId !== productId)
            : prev.map((p) =>
                p.productId === productId ? { ...p, qty } : p
              )
        ),
      remove: (productId) =>
        setItems((prev) => prev.filter((p) => p.productId !== productId)),
      clear: () => setItems([]),
    };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
