import { IconArrowRight } from "@/components/store/icons";
import type { BrandConfig, StoreHero } from "@/lib/store-types";

export type HeroSectionProps = {
  brand: BrandConfig;
  hero: StoreHero;
};

/**
 * Splits a headline into segments. Text wrapped in `*…*` is rendered with
 * the brand primary color to highlight it. Anything else is plain text.
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

export function HeroSection({ brand, hero }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full"
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 lg:pt-32 lg:pb-36 xl:px-10 2xl:px-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
          {/* Eyebrow */}
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
            {hero.eyebrow}
          </p>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="font-display text-[2.5rem] leading-[1.08] tracking-tight text-[var(--store-text)] sm:text-6xl lg:text-[4.5rem]"
          >
            {renderHeadline(hero.headline)}
          </h1>

          {/* Subline */}
          {hero.subline ? (
            <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--store-text-soft)] sm:text-[19px]">
              {hero.subline}
            </p>
          ) : null}

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={hero.primaryCta.anchor}
              className="store-btn-solid inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium"
            >
              {hero.primaryCta.label}
              <IconArrowRight className="h-[14px] w-[14px]" />
            </a>
            {hero.secondaryCta ? (
              <a
                href={hero.secondaryCta.anchor}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--store-primary)]/35 bg-transparent px-6 py-3 text-[14px] font-medium text-[var(--store-primary)] transition hover:border-[var(--store-primary)]/70 hover:bg-[var(--store-primary)]/5"
              >
                {hero.secondaryCta.label}
              </a>
            ) : null}
          </div>

          {/* Brand mark — small, refined, no decoration */}
          <div className="mt-4 flex flex-col items-center gap-1 text-[var(--store-text-soft)]">
            <span className="font-display text-[12px] font-semibold uppercase tracking-[0.2em]">
              {brand.name}
            </span>
            {brand.tagline ? (
              <span className="text-[12px]">{brand.tagline}</span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
