import Image from "next/image";
import { IconArrowRight } from "@/components/store/icons";
import type {
  BrandConfig,
  StoreHero,
  StoreStat,
} from "@/lib/store-types";

export type HeroSectionProps = {
  brand: BrandConfig;
  hero: StoreHero;
  /** Imagen grande del hero (debajo del copy) */
  image?: { src: string; alt: string };
  /** Stats inline — fila corta debajo del CTA */
  stats?: StoreStat[];
};

/**
 * Hero editorial — centrado, tipografía display, imagen dominante y
 * stats inline. Reemplaza el antiguo HeroSection con un layout más
 * "Apple keynote": copy arriba, imagen abajo, micro-stats al final.
 */
export function HeroSection({ brand, hero, image, stats }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden"
    >
      {/* Subtle radial backdrop — premium sin romper la paleta neutral */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--store-muted)_0%,_transparent_60%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-28 lg:pb-20 xl:px-10 2xl:px-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--store-primary)]">
            {hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="font-display text-[2.75rem] leading-[1.04] tracking-tight text-[var(--store-text)] sm:text-6xl lg:text-[5rem]"
          >
            {renderHeadline(hero.headline)}
          </h1>

          {hero.subline ? (
            <p className="max-w-2xl text-[16px] leading-relaxed text-[var(--store-text-soft)] sm:text-[18px]">
              {hero.subline}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href={hero.primaryCta.anchor}
              className="store-btn-solid inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-medium"
            >
              {hero.primaryCta.label}
              <IconArrowRight className="h-[14px] w-[14px]" />
            </a>
            {hero.secondaryCta ? (
              <a
                href={hero.secondaryCta.anchor}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--store-border)] bg-[var(--store-surface)]/70 px-7 py-3.5 text-[14px] font-medium text-[var(--store-text)] backdrop-blur transition hover:border-[var(--store-primary)]/55 hover:text-[var(--store-primary)]"
              >
                {hero.secondaryCta.label}
              </a>
            ) : null}
          </div>
        </div>

        {/* Imagen grande del hero */}
        {image ? (
          <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16 lg:mt-20">
            <div className="store-shadow-hero relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--store-border)] bg-[var(--store-muted)]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
                className="object-cover"
              />
              {/* Vignette muy sutil para fundir con el fondo */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--store-page-bg)]/15"
              />
            </div>
          </div>
        ) : null}

        {/* Stats inline */}
        {stats && stats.length > 0 ? (
          <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-y-6 gap-x-6 border-t border-[var(--store-border)] pt-10 sm:grid-cols-4 sm:gap-x-10 lg:mt-20">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center gap-1 text-center"
              >
                <dt className="order-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--store-text-soft)]">
                  {stat.label}
                </dt>
                <dd className="order-1 font-display text-[2rem] leading-none tracking-tight text-[var(--store-text)] sm:text-[2.25rem]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* Brand mark */}
        <div className="mt-10 flex flex-col items-center gap-1 text-[var(--store-text-soft)] lg:mt-14">
          <span className="font-display text-[12px] font-semibold uppercase tracking-[0.2em]">
            {brand.name}
          </span>
          {brand.tagline ? (
            <span className="text-[12px]">{brand.tagline}</span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Splits a headline into segments. Text wrapped in `*…*` renders with brand
 * primary color.
 */
function renderHeadline(headline: string) {
  const parts = headline.split(/(\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={idx} className="text-[var(--store-primary)]">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}