"use client";

import { createContext, useContext, ReactNode } from "react";
import type { StoreSettingsDTO } from "@/lib/types";
import { useLocalStorageState } from "@/lib/use-local-storage-state";

export type CookieItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  visual: { bg: string; emoji: string };
  imageUrl: string | null;
  cardPrice: number | null;
  stockQuantity: number | null;
};

export type CartEntry = CookieItem & { quantity: number };

type CartContextType = {
  cart: CartEntry[];
  cartCount: number;
  cartTotal: number;
  delivery: number;
  orderTotal: number;
  addToCart: (cookie: CookieItem) => void;
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: StoreSettingsDTO;
}) {
  const [cart, setCart] = useLocalStorageState<CartEntry[]>(`cart:${settings.slug}`, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery =
    cartTotal === 0 || cartTotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const orderTotal = cartTotal + delivery;

  const addToCart = (cookie: CookieItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === cookie.id);
      if (existing) {
        if (cookie.stockQuantity !== null && existing.quantity >= cookie.stockQuantity) return prev;
        return prev.map((i) =>
          i.id === cookie.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      if (cookie.stockQuantity !== null && cookie.stockQuantity <= 0) return prev;
      return [...prev, { ...cookie, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    });
  };

  const deleteFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        delivery,
        orderTotal,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
