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
      className={`relative w-full border-b border-[var(--store-border-subtle)] bg-[var(--store-nav-glass)] backdrop-blur-xl backdrop-saturate-150 ${
        sticky ? "sticky top-0 z-50" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--store-nav-top-line),transparent)]"
        aria-hidden
      />
      <div className="relative flex w-full flex-col px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="relative h-[3.95rem] sm:h-[4.25rem] md:h-[4.75rem]">
          {hasLinks ? (
            <div className="flex h-full items-center justify-between gap-2 sm:gap-4">
              <BrandLogo {...brand} className="max-w-[11rem] sm:max-w-none" />

              <nav
                className="hidden items-center gap-9 md:flex"
                aria-label="Principal"
              >
                {links.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="store-nav-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-nav-bg)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] sm:h-10 sm:w-10 md:hidden"
                  aria-expanded={open}
                  aria-controls="mobile-nav"
                  onClick={() => setOpen((v) => !v)}
                >
                  <span className="sr-only">Abrir menú</span>
                  <IconMenu />
                </button>
                <div className="flex items-center gap-0.5 rounded-full border border-[var(--store-border-subtle)] bg-[var(--store-muted)]/45 p-0.5 sm:p-1 backdrop-blur-sm">
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
                <div className="flex items-center gap-0.5 rounded-full border border-[var(--store-border-subtle)] bg-[var(--store-muted)]/45 p-0.5 sm:p-1 backdrop-blur-sm">
                  <ThemeToggle />
                  <CartButton />
                </div>
              </div>
            </>
          )}
        </div>
        <div
          id="mobile-nav"
          className={`border-t border-[var(--store-border-subtle)] md:hidden ${
            open && hasLinks ? "block" : "hidden"
          }`}
        >
          <nav
            className="flex flex-col gap-0.5 py-4"
            aria-label="Móvil"
          >
            {links.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)]"
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
