"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { CartDrawer } from "@/components/store/cart-drawer";
import {
  addProductToCart,
  cartTotalQuantity,
  CART_UPDATED_EVENT,
  clearCart,
  getCartStorageRaw,
  parseCartJson,
  removeLineFromCart,
  setLineQuantity,
  type CartLineItem,
} from "@/lib/cart-storage";
import type { StoreProduct } from "@/lib/store-types";

type CartContextValue = {
  items: CartLineItem[];
  totalQuantity: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: StoreProduct) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function subscribeCart(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CART_UPDATED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CART_UPDATED_EVENT, callback);
  };
}

function getServerCartSnapshot(): string {
  return "[]";
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const raw = useSyncExternalStore(
    subscribeCart,
    getCartStorageRaw,
    getServerCartSnapshot,
  );

  const items = useMemo(() => parseCartJson(raw), [raw]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const addItem = useCallback((product: StoreProduct) => {
    addProductToCart(product);
  }, []);

  const removeItem = useCallback((productId: string) => {
    removeLineFromCart(productId);
  }, []);

  const setQuantityCb = useCallback((productId: string, quantity: number) => {
    setLineQuantity(productId, quantity);
  }, []);

  const clear = useCallback(() => {
    clearCart();
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity: cartTotalQuantity(items),
      isDrawerOpen: drawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      setQuantity: setQuantityCb,
      clear,
    }),
    [
      items,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      setQuantityCb,
      clear,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
