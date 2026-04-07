"use client";

import { useCart } from "@/components/store/cart-context";
import { IconCart } from "@/components/store/icons";

export type CartButtonProps = {
  label?: string;
};

export function CartButton({ label = "Abrir carrito" }: CartButtonProps) {
  const { openDrawer, totalQuantity } = useCart();
  const display = totalQuantity > 99 ? "99+" : String(totalQuantity);

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={label}
      aria-haspopup="dialog"
      className="relative grid h-10 w-10 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-muted)]"
    >
      <IconCart className="h-6 w-6" />
      {totalQuantity > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 grid min-h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-[var(--store-badge)] px-1 text-[10px] font-semibold text-[var(--store-on-badge)]"
          aria-hidden
        >
          {display}
        </span>
      ) : null}
    </button>
  );
}
