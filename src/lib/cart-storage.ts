import type { StoreProduct } from "@/lib/store-types";

export const CART_STORAGE_KEY = "store-cart-items";

export const CART_UPDATED_EVENT = "store-cart-updated";

export type CartLineItem = {
  id: string;
  title: string;
  price: number;
  currencySymbol: string;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
};

function isLineItem(x: unknown): x is CartLineItem {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.price === "number" &&
    typeof o.currencySymbol === "string" &&
    typeof o.imageSrc === "string" &&
    typeof o.imageAlt === "string" &&
    typeof o.quantity === "number" &&
    o.quantity >= 1
  );
}

export function getCartStorageRaw(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(CART_STORAGE_KEY) ?? "[]";
}

export function parseCartJson(raw: string): CartLineItem[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isLineItem);
  } catch {
    return [];
  }
}

export function readCartFromStorage(): CartLineItem[] {
  return parseCartJson(getCartStorageRaw());
}

export function writeCartToStorage(items: CartLineItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function cartTotalQuantity(items: CartLineItem[]): number {
  return items.reduce((sum, line) => sum + line.quantity, 0);
}

export function addProductToCart(product: StoreProduct) {
  const items = readCartFromStorage();
  const idx = items.findIndex((l) => l.id === product.id);
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      quantity: items[idx].quantity + 1,
    };
  } else {
    items.push({
      id: product.id,
      title: product.title,
      price: product.price,
      currencySymbol: product.currencySymbol,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
      quantity: 1,
    });
  }
  writeCartToStorage(items);
}

export function removeLineFromCart(productId: string) {
  const items = readCartFromStorage().filter((l) => l.id !== productId);
  writeCartToStorage(items);
}

export function setLineQuantity(productId: string, quantity: number) {
  if (quantity < 1) {
    removeLineFromCart(productId);
    return;
  }
  const items = readCartFromStorage().map((l) =>
    l.id === productId ? { ...l, quantity } : l,
  );
  writeCartToStorage(items);
}

export function clearCart() {
  writeCartToStorage([]);
}
