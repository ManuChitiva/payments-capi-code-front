"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/store/brand-logo";
import { CartButton } from "@/components/store/cart-button";
import {
  IconClose,
  IconHeart,
  IconMenu,
  IconUser,
} from "@/components/store/icons";
import { ThemeToggle } from "@/components/store/theme-toggle";
import { useAdvisorsModal } from "@/components/store/advisors-launcher";
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
  const [scrolled, setScrolled] = useState(false);
  const hasLinks = links.length > 0;
  const advisorsModal = useAdvisorsModal();

  useEffect(() => {
    if (!sticky) return;
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const containerClass =
    "mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

  const iconButtonClass =
    "relative grid h-10 w-10 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)]";

  const headerClass = `relative w-full border-b border-[var(--store-border)] bg-[var(--store-surface)] transition-shadow duration-300 ${
    sticky ? "sticky top-0 z-50" : ""
  } ${
    scrolled ? "shadow-[var(--store-shadow-soft)]" : ""
  }`;

  /**
   * Renderiza un link del navbar. Si `item.kind === "advisors"`, se renderiza
   * como botón que abre el modal de asesores en lugar de navegar a un anchor.
   */
  const renderNavItem = (item: NavLinkItem, variant: "desktop" | "mobile") => {
    const isAdvisorsTrigger = item.kind === "advisors";
    const handleClick = () => {
      if (isAdvisorsTrigger) {
        advisorsModal?.open();
      }
      if (variant === "mobile") setOpen(false);
    };

    if (isAdvisorsTrigger) {
      return (
        <button
          key={item.label}
          type="button"
          onClick={handleClick}
          disabled={!advisorsModal?.hasAdvisors}
          title={
            advisorsModal?.hasAdvisors
              ? undefined
              : "Aún no hay asesores publicados."
          }
          className={
            variant === "desktop"
              ? "group relative inline-flex items-center text-[13.5px] font-medium tracking-tight text-[var(--store-text)] transition hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)] disabled:cursor-not-allowed disabled:opacity-70"
              : "rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--store-text)] transition hover:bg-[var(--store-muted)] hover:text-[var(--store-primary)] disabled:cursor-not-allowed disabled:opacity-70 text-left"
          }
        >
          {item.label}
          {variant === "desktop" ? (
            <span
              aria-hidden
              className="absolute -bottom-1.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[var(--store-primary)] transition-all duration-300 ease-out group-hover:w-full"
            />
          ) : null}
        </button>
      );
    }

    return (
      <Link
        key={item.href + item.label}
        href={item.href}
        onClick={variant === "mobile" ? () => setOpen(false) : undefined}
        className={
          variant === "desktop"
            ? "group relative inline-flex items-center text-[13.5px] font-medium tracking-tight text-[var(--store-text)] transition hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)]"
            : "rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--store-text)] transition hover:bg-[var(--store-muted)] hover:text-[var(--store-primary)]"
        }
      >
        {item.label}
        {variant === "desktop" ? (
          <span
            aria-hidden
            className="absolute -bottom-1.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[var(--store-primary)] transition-all duration-300 ease-out group-hover:w-full"
          />
        ) : null}
      </Link>
    );
  };

  return (
    <header className={headerClass}>
      <div className={`${containerClass} min-h-[4.25rem] sm:min-h-[4.5rem] lg:min-h-[4.75rem]`}>
        {/* Left: brand */}
        <div className="flex items-center gap-4">
          {hasLinks ? (
            <button
              type="button"
              className="grid h-10 w-10 -ml-2 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)] md:hidden"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Abrir menú</span>
              <IconMenu />
            </button>
          ) : null}
          <BrandLogo
            {...brand}
            size="md"
            className="max-w-[14rem] sm:max-w-none"
          />
        </div>

        {/* Center: nav links */}
        {hasLinks ? (
          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Principal"
          >
            {links.map((item) => renderNavItem(item, "desktop"))}
          </nav>
        ) : (
          <span aria-hidden />
        )}

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <Link
            href="#favoritos"
            aria-label="Favoritos"
            className={iconButtonClass}
          >
            <IconHeart className="h-[20px] w-[20px]" />
          </Link>
          <Link
            href="#cuenta"
            aria-label="Mi cuenta"
            className={iconButtonClass}
          >
            <IconUser className="h-[20px] w-[20px]" />
          </Link>
          <span
            className="hidden h-6 w-px bg-[var(--store-border)] sm:inline-block"
            aria-hidden
          />
          <ThemeToggle />
          <CartButton />
        </div>
      </div>

      {/* Mobile drawer */}
      {hasLinks ? (
        <div
          id="mobile-drawer"
          className={`fixed inset-0 z-40 md:hidden ${
            open ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!open}
        >
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setOpen(false)}
          />
          <aside
            className={`absolute inset-y-0 left-0 flex w-[min(82vw,20rem)] flex-col gap-1 border-r border-[var(--store-border)] bg-[var(--store-surface)] p-4 pt-5 shadow-[var(--store-shadow-hover)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <BrandLogo {...brand} size="md" className="max-w-[12rem]" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-[var(--store-text)] transition hover:bg-[var(--store-hover-overlay)]"
                aria-label="Cerrar menú"
              >
                <IconClose />
              </button>
            </div>
            <nav
              className="flex flex-col gap-1 pt-2"
              aria-label="Menú móvil"
            >
              {links.map((item) => renderNavItem(item, "mobile"))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t border-[var(--store-border)] pt-4">
              <Link
                href="#favoritos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-[var(--store-text)] transition hover:bg-[var(--store-muted)]"
              >
                <IconHeart className="h-[18px] w-[18px]" />
                Favoritos
              </Link>
              <Link
                href="#cuenta"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-[var(--store-text)] transition hover:bg-[var(--store-muted)]"
              >
                <IconUser className="h-[18px] w-[18px]" />
                Mi cuenta
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}