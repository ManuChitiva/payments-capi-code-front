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
      ? "text-[0.95rem] sm:text-[1.05rem]"
      : monoLen === 2
        ? "text-[0.68rem] tracking-tight sm:text-[0.78rem]"
        : monoLen === 3
          ? "text-[0.58rem] sm:text-[0.68rem]"
          : "text-[0.52rem] sm:text-[0.6rem]";

  const inner = (
    <span className={`flex min-w-0 items-center gap-2.5 sm:gap-3.5 ${className}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={48}
          height={48}
          className="h-9 w-9 shrink-0 rounded-lg border border-[var(--store-border-subtle)] bg-[var(--store-surface)] p-0.5 object-contain shadow-[var(--store-shadow-soft)] sm:h-11 sm:w-11 sm:rounded-xl sm:p-1"
        />
      ) : (
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-lg border border-[var(--store-gold-border)] bg-gradient-to-br from-[var(--store-champagne)] via-[var(--store-muted)] to-[var(--store-surface)] px-1 py-1.5 font-brand shadow-[var(--store-shadow-soft)] sm:h-11 sm:w-11 sm:rounded-xl sm:py-1"
          aria-hidden
        >
          <span
            className={`store-text-gold block max-w-full text-center leading-[1.2] ${monogramSizeClass}`}
          >
            {monogram}
          </span>
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5 leading-none">
        <span className="truncate text-[12px] font-semibold tracking-[0.08em] text-[var(--store-primary)] sm:text-[13px] sm:tracking-[0.14em]">
          {name}
        </span>
        {tagline ? (
          <span className="hidden text-[11px] font-medium tracking-wide text-[var(--store-text-soft)] sm:block">
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
