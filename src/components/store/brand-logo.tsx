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
    <span className={`flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={48}
          height={48}
          className="h-8 w-8 shrink-0 rounded-md border border-[var(--store-border-subtle)] bg-[var(--store-surface)] p-0.5 object-contain sm:h-9 sm:w-9"
        />
      ) : (
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--store-border-subtle)] bg-[var(--store-muted)] px-1 font-display font-semibold text-[var(--store-primary)] sm:h-9 sm:w-9"
          aria-hidden
        >
          <span className={`block max-w-full text-center leading-none ${monogramSizeClass}`}>
            {monogram}
          </span>
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5 leading-none">
        <span className="truncate text-[13px] font-semibold tracking-tight text-[var(--store-text)] sm:text-[14px]">
          {name}
        </span>
        {tagline ? (
          <span className="hidden text-[11px] font-normal text-[var(--store-text-soft)] sm:block">
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
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)]"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
