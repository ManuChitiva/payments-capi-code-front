"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/store/brand-logo";
import { CartButton } from "@/components/store/cart-button";
import { IconMenu } from "@/components/store/icons";
import { ThemeToggle } from "@/components/store/theme-toggle";
import type { BrandConfig, NavLinkItem } from "@/lib/store-types";

export type StoreNavbarProps = {
  brand: BrandConfig;
  links: NavLinkItem[];
  sticky?: boolean;
};

export function StoreNavbar({
  brand,
  links,
  sticky = true,
}: StoreNavbarProps) {
  const [open, setOpen] = useState(false);
  const hasLinks = links.length > 0;

  return (
    <header
      className={`relative w-full border-b border-[var(--store-border)] bg-[var(--store-surface)]/80 backdrop-blur-xl backdrop-saturate-150 ${
        sticky ? "sticky top-0 z-50" : ""
      }`}
    >
      <div className="relative flex w-full flex-col px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="relative h-[3.5rem] sm:h-[3.75rem] md:h-[4rem]">
          {hasLinks ? (
            <div className="flex h-full items-center justify-between gap-2 sm:gap-4">
              <BrandLogo {...brand} className="max-w-[11rem] sm:max-w-none" />

              <nav
                className="hidden items-center gap-7 md:flex"
                aria-label="Principal"
              >
                {links.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="store-nav-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-md text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] sm:h-10 sm:w-10 md:hidden"
                  aria-expanded={open}
                  aria-controls="mobile-nav"
                  onClick={() => setOpen((v) => !v)}
                >
                  <span className="sr-only">Abrir menú</span>
                  <IconMenu />
                </button>
                <div className="flex items-center gap-0.5">
                  <ThemeToggle />
                  <CartButton />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex h-full items-center justify-center">
                <BrandLogo {...brand} className="max-w-[14rem] sm:max-w-none" />
              </div>
              <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center">
                <div className="flex items-center gap-0.5">
                  <ThemeToggle />
                  <CartButton />
                </div>
              </div>
            </>
          )}
        </div>
        <div
          id="mobile-nav"
          className={`border-t border-[var(--store-border)] md:hidden ${
            open && hasLinks ? "block" : "hidden"
          }`}
        >
          <nav
            className="flex flex-col gap-0.5 py-3"
            aria-label="Móvil"
          >
            {links.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-[15px] font-normal text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}