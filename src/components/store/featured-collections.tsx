import Image from "next/image";
import { IconArrowUpRight } from "@/components/store/icons";
import type { StoreFeaturedCollection } from "@/lib/store-types";

export type FeaturedCollectionsProps = {
  eyebrow?: string;
  headline?: string;
  subline?: string;
  collections: StoreFeaturedCollection[];
};

/**
 * Colecciones destacadas — bloque editorial de 3 cards grandes.
 * Una es doble de alta (la primera) para crear jerarquía tipo Apple.
 */
export function FeaturedCollections({
  eyebrow = "Colecciones",
  headline = "Explora nuestras líneas principales.",
  subline = "Cada colección está curada con productos originales y el respaldo de marcas reconocidas.",
  collections,
}: FeaturedCollectionsProps) {
  if (!collections || collections.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-collections-heading"
      className="relative w-full"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">
        <header className="mb-10 max-w-2xl space-y-3 sm:mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
            {eyebrow}
          </p>
          <h2
            id="featured-collections-heading"
            className="font-display text-3xl tracking-tight text-[var(--store-text)] sm:text-4xl lg:text-[2.75rem]"
          >
            {headline}
          </h2>
          <p className="text-[15px] leading-relaxed text-[var(--store-text-soft)] sm:text-[16px]">
            {subline}
          </p>
        </header>

        {/*
         * Layout: la primera card ocupa una fila completa, las siguientes
         * van en grid 1x2 (en sm+) o stack vertical (en móvil). Jerarquía
         * editorial tipo Apple.
         */}
        <div className="grid grid-cols-1 gap-5 lg:gap-6">
          <CollectionCard collection={collections[0]} variant="hero" />

          {collections.length > 1 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
              {collections.slice(1).map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  variant="split"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

type Variant = "hero" | "split";

function CollectionCard({
  collection,
  variant,
}: {
  collection: StoreFeaturedCollection;
  variant: Variant;
}) {
  const isHero = variant === "hero";
  const aspectClass = isHero
    ? "aspect-[16/9] sm:aspect-[21/9]"
    : "aspect-[4/3] sm:aspect-[16/10]";

  return (
    <a
      href={collection.href}
      className="group store-lift relative block w-full overflow-hidden rounded-2xl border border-[var(--store-border)] bg-[var(--store-muted)]"
    >
      <div className={`relative w-full ${aspectClass}`}>
        <Image
          src={collection.imageSrc}
          alt={collection.imageAlt}
          fill
          sizes={
            isHero
              ? "(max-width: 1024px) 100vw, 1024px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 512px"
          }
          className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        {/* Gradient for legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"
        />
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 text-white ${
          isHero
            ? "p-6 sm:p-8 lg:p-10"
            : "p-5 sm:p-6"
        }`}
      >
        <div className="min-w-0 flex-1">
          <h3
            className={`font-display tracking-tight ${
              isHero
                ? "text-[1.5rem] sm:text-[2rem] lg:text-[2.25rem]"
                : "text-[1.25rem] sm:text-[1.5rem]"
            }`}
          >
            {collection.name}
          </h3>
          <p
            className={`mt-2 max-w-md text-white/85 ${
              isHero ? "text-[14px] sm:text-[15px]" : "text-[13px]"
            }`}
          >
            {collection.description}
          </p>
        </div>
        <span
          className={`grid shrink-0 place-items-center rounded-full bg-white/95 text-[var(--store-text)] shadow-[var(--store-shadow-soft)] backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
            isHero ? "h-12 w-12" : "h-10 w-10"
          }`}
        >
          <IconArrowUpRight
            className={isHero ? "h-[18px] w-[18px]" : "h-[14px] w-[14px]"}
          />
        </span>
      </div>
    </a>
  );
}
