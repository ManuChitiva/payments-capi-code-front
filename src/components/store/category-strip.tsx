import Image from "next/image";
import type { StoreFeaturedCategory } from "@/lib/store-types";

export type CategoryStripProps = {
  eyebrow?: string;
  headline?: string;
  subline?: string;
  categories: StoreFeaturedCategory[];
  /** Default anchor to scroll to when a card has no href */
  fallbackHref?: string;
};

export function CategoryStrip({
  eyebrow = "Colección curada",
  headline = "Explora por categoría",
  subline = "Encuentra rápidamente el producto ideal para tu rutina, sea cual sea el momento del día.",
  categories,
  fallbackHref = "#productos",
}: CategoryStripProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section
      aria-labelledby="categories-heading"
      className="relative w-full"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:px-10 2xl:px-12">
        <header className="mb-8 flex flex-col gap-3 sm:mb-10 sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
              {eyebrow}
            </p>
            <h2
              id="categories-heading"
              className="font-display text-3xl tracking-tight text-[var(--store-text)] sm:text-4xl"
            >
              {headline}
            </h2>
            {subline ? (
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--store-text-soft)]">
                {subline}
              </p>
            ) : null}
          </div>
        </header>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href={cat.href ?? fallbackHref}
                className="group relative block aspect-square overflow-hidden rounded-xl border border-[var(--store-border)] bg-[var(--store-muted)] transition-shadow hover:shadow-[var(--store-shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-page-bg)]"
              >
                <Image
                  src={cat.imageSrc}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                {/* Contrast gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"
                  aria-hidden
                />
                {/* Name */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-3.5">
                  <span className="text-[15px] font-medium leading-tight text-white sm:text-base">
                    {cat.name}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
