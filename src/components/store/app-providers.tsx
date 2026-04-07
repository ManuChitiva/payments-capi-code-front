"use client";

import { CartProvider } from "@/components/store/cart-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
