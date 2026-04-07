import Image from "next/image";
import Link from "next/link";
import type { BrandConfig } from "@/lib/store-types";

export type BrandLogoProps = BrandConfig & {
  className?: string;
};

export function BrandLogo({
  monogram,
  name,
  tagline,
  logoUrl,
  homeHref = "/",
  className = "",
}: BrandLogoProps) {
  const monoLen = monogram.trim().length;
  const monogramSizeClass =
    monoLen <= 1
      ? "text-2xl"
      : monoLen === 2
        ? "text-[1rem] tracking-tight sm:text-[1.125rem]"
        : monoLen === 3
          ? "text-[0.72rem] sm:text-sm"
          : "text-[0.62rem] leading-none sm:text-[0.7rem]";

  const inner = (
    <span className={`flex items-center gap-3.5 ${className}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={48}
          height={48}
          className="h-11 w-11 shrink-0 rounded-xl border border-[var(--store-border-subtle)] object-cover shadow-[var(--store-shadow-soft)]"
        />
      ) : (
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--store-gold-border)] bg-gradient-to-br from-[var(--store-champagne)] via-[var(--store-muted)] to-[var(--store-surface)] px-1 font-brand leading-none shadow-[var(--store-shadow-soft)]"
          aria-hidden
        >
          <span
            className={`store-text-gold max-w-full text-center leading-none ${monogramSizeClass}`}
          >
            {monogram}
          </span>
        </span>
      )}
      <span className="flex flex-col gap-0.5 leading-none">
        <span className="text-[13px] font-semibold tracking-[0.14em] text-[var(--store-primary)]">
          {name}
        </span>
        {tagline ? (
          <span className="text-[11px] font-medium tracking-wide text-[var(--store-text-soft)]">
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (homeHref) {
    return (
      <Link
        href={homeHref}
        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-nav-bg)]"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
