import Image from "next/image";
import Link from "next/link";
import type { BrandConfig } from "@/lib/store-types";

export type BrandLogoProps = BrandConfig & {
  className?: string;
  /** Tamaño del badge. Default: "md" (más grande que antes). */
  size?: "sm" | "md" | "lg";
  /** Forma del badge. Default: "circle" — encaja con la metáfora de rueda. */
  shape?: "circle" | "rounded";
};

const SIZE_CLASSES = {
  // Antes: 32px / 36px. Subimos para tener presencia real.
  sm: {
    box: "h-9 w-9 sm:h-10 sm:w-10",
    imageBox: "h-9 w-9 sm:h-10 sm:w-10",
    padding: "p-1",
    name: "text-[13px] sm:text-[14px]",
    tagline: "text-[11px]",
    monogram: "max-w-full text-center leading-none",
  },
  md: {
    box: "h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem]",
    imageBox: "h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem]",
    padding: "p-1.5",
    name: "text-[15px] sm:text-[16px]",
    tagline: "text-[11.5px]",
    monogram: "max-w-full text-center leading-none",
  },
  lg: {
    box: "h-14 w-14 sm:h-16 sm:w-16",
    imageBox: "h-14 w-14 sm:h-16 sm:w-16",
    padding: "p-2",
    name: "text-[17px] sm:text-[19px]",
    tagline: "text-[13px]",
    monogram: "max-w-full text-center leading-none",
  },
} as const;

const SHAPE_CLASS = {
  circle: "rounded-full",
  rounded: "rounded-xl",
} as const;

function monogramSizeClass(monogram: string): string {
  const monoLen = monogram.trim().length;
  if (monoLen <= 1) return "text-[1.1rem] sm:text-[1.25rem]";
  if (monoLen === 2) return "text-[0.85rem] sm:text-[0.95rem] tracking-tight";
  if (monoLen === 3) return "text-[0.7rem] sm:text-[0.78rem]";
  return "text-[0.62rem] sm:text-[0.7rem]";
}

export function BrandLogo({
  monogram,
  name,
  tagline,
  logoUrl,
  homeHref = "/",
  className = "",
  size = "md",
  shape = "circle",
}: BrandLogoProps) {
  const sizing = SIZE_CLASSES[size];
  const shapeClass = SHAPE_CLASS[shape];
  // Padding visible dentro del círculo para que el monogram/imagen no toque el borde.
  const boxPadding = sizing.padding;
  // Tipografía de monogram proporcional al tamaño del badge.
  const monoText = monogramSizeClass(monogram);

  const inner = (
    <span className={`flex min-w-0 items-center gap-3 sm:gap-3.5 ${className}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={64}
          height={64}
          className={`${sizing.imageBox} ${shapeClass} shrink-0 border border-[var(--store-border-subtle)] bg-[var(--store-surface)] object-cover`}
        />
      ) : (
        <span
          className={`${sizing.box} ${shapeClass} ${boxPadding} flex shrink-0 items-center justify-center border border-[var(--store-border-subtle)] bg-[var(--store-muted)] font-display font-semibold text-[var(--store-primary)]`}
          aria-hidden
        >
          <span className={`${monoText} ${sizing.monogram}`}>{monogram}</span>
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5 leading-none">
        <span
          className={`truncate font-semibold tracking-tight text-[var(--store-text)] ${sizing.name}`}
        >
          {name}
        </span>
        {tagline ? (
          <span
            className={`hidden truncate font-normal text-[var(--store-text-soft)] sm:block ${sizing.tagline}`}
          >
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
