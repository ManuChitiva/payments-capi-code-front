import type {
  StoreProduct,
  StoreProductVariant,
} from "@/lib/store-types";

export const CART_STORAGE_KEY = "store-cart-items";

export const CART_UPDATED_EVENT = "store-cart-updated";

export type CartLineItem = {
  /** Id único de la línea. Para productos simples es el productId; para variantes, `${productId}::${variantId}`. */
  id: string;
  productId: string;
  title: string;
  /** Título de la variante seleccionada (si aplica). Vacío para producto simple. */
  variantTitle: string;
  /** SKU de la variante (si aplica) — útil para confirmar el pedido. */
  variantSku: string;
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
    typeof o.productId === "string" &&
    typeof o.title === "string" &&
    typeof o.variantTitle === "string" &&
    typeof o.variantSku === "string" &&
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

export type CartLineInput = {
  product: StoreProduct;
  variant?: StoreProductVariant;
};

/**
 * Construye la línea que se añadirá al carrito para un (producto, variante?).
 * Centraliza la regla "cada variante = su propia línea".
 */
export function buildCartLineFromInput({
  product,
  variant,
}: CartLineInput): CartLineItem {
  if (variant) {
    return {
      id: `${product.id}::${variant.id}`,
      productId: product.id,
      title: product.title,
      variantTitle: variant.title,
      variantSku: variant.sku,
      price: variant.price,
      currencySymbol: variant.currencySymbol || product.currencySymbol,
      imageSrc: variant.imageSrc,
      imageAlt: variant.imageAlt || variant.title,
      quantity: 1,
    };
  }
  return {
    id: product.id,
    productId: product.id,
    title: product.title,
    variantTitle: "",
    variantSku: "",
    price: product.price,
    currencySymbol: product.currencySymbol,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    quantity: 1,
  };
}

export function addProductToCart(product: StoreProduct, variant?: StoreProductVariant) {
  const items = readCartFromStorage();
  const line = buildCartLineFromInput({ product, variant });
  const idx = items.findIndex((l) => l.id === line.id);
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      quantity: items[idx].quantity + 1,
    };
  } else {
    items.push(line);
  }
  writeCartToStorage(items);
}

export function removeLineFromCart(lineId: string) {
  const items = readCartFromStorage().filter((l) => l.id !== lineId);
  writeCartToStorage(items);
}

export function setLineQuantity(lineId: string, quantity: number) {
  if (quantity < 1) {
    removeLineFromCart(lineId);
    return;
  }
  const items = readCartFromStorage().map((l) =>
    l.id === lineId ? { ...l, quantity } : l,
  );
  writeCartToStorage(items);
}

export function clearCart() {
  writeCartToStorage([]);
}