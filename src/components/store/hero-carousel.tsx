"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useAdvisorsModal } from "@/components/store/advisors-launcher";
import {
  IconArrowLeft,
  IconArrowRight,
} from "@/components/store/icons";
import type { StoreHeroSlide } from "@/lib/store-types";

export type HeroCarouselProps = {
  slides: StoreHeroSlide[];
  /** Intervalo de auto-rotación en ms. 0 desactiva. Default: 7000 */
  autoPlayMs?: number;
  /**
   * Imagen de fondo por defecto para los slides que no traigan su propia
   * `image`. Útil para pasar la foto de portada del API y que cada slide
   * se vea como un "spot" publicitario sobre la misma foto.
   */
  fallbackImage?: { src: string; alt: string };
};

/**
 * Carrusel publicitario estilo Apple keynote:
 * - 1 slide visible a la vez, transiciones suaves (fade).
 * - Cada slide puede llevar su propia imagen de fondo (full-bleed) o un
 *   `fallbackImage` compartido (p.ej. `coverImageUrl` del API).
 * - Cuando hay imagen: overlay degradado + texto blanco con drop-shadow.
 * - Cuando no hay imagen: tono sólido pre-definido y paleta neutral.
 * - Auto-rotación con pausa al hacer hover o al enfocar controles.
 */
export function HeroCarousel({
  slides,
  autoPlayMs = 7000,
  fallbackImage,
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const advisorsModal = useAdvisorsModal();
  const regionId = useId();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = slides.length;
  const safeIndex = count > 0 ? index % count : 0;

  // Auto-rotación
  useEffect(() => {
    if (paused || count <= 1 || autoPlayMs <= 0) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % count);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, count, autoPlayMs, safeIndex]);

  if (count === 0) return null;

  const go = (next: number) => {
    setIndex(((next % count) + count) % count);
  };

  const toneClass = (tone: StoreHeroSlide["tone"]): string => {
    switch (tone) {
      case "warm":
        return "bg-[#f5efe8]"; // beige muy sutil
      case "cool":
        return "bg-[#eef2f7]"; // azul-gris muy sutil
      case "subtle":
        return "bg-[#f3f3f4]";
      default:
        return "bg-[var(--store-muted)]";
    }
  };

  const resolveSlideImage = (
    slide: StoreHeroSlide,
  ): { src: string; alt: string } | undefined => {
    if (slide.image) return slide.image;
    if (fallbackImage) {
      return {
        src: fallbackImage.src,
        alt: `${fallbackImage.alt} — ${slide.headline}`,
      };
    }
    return undefined;
  };

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados"
      aria-controls={regionId}
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden">
        <div
          id={regionId}
          aria-live={paused ? "polite" : "off"}
          className="relative w-full"
        >
          {slides.map((slide, i) => {
            const slideImage = resolveSlideImage(slide);
            const onPhoto = Boolean(slideImage);
            return (
              <article
                key={slide.id}
                aria-hidden={i !== safeIndex}
                className={`w-full transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  i === safeIndex
                    ? "relative opacity-100"
                    : "pointer-events-none absolute inset-0 opacity-0"
                } ${
                  onPhoto
                    ? "text-white"
                    : `${toneClass(slide.tone)} text-[var(--store-text)]`
                }`}
              >
                {/* Background full-bleed */}
                {slideImage ? (
                  <>
                    <Image
                      src={slideImage.src}
                      alt={slideImage.alt}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="absolute inset-0 z-0 h-full w-full object-cover object-center"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/35 to-black/70"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top_right,_var(--store-primary)_/_0.18,_transparent_55%)]"
                    />
                  </>
                ) : null}

                <div className="relative z-[2] mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-center px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-12 2xl:px-14">
                  <p
                    className={
                      onPhoto
                        ? "text-[12px] font-semibold uppercase tracking-[0.22em] text-white/85"
                        : "text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--store-primary)]"
                    }
                  >
                    {slide.eyebrow}
                  </p>
                  <h1
                    className={
                      onPhoto
                        ? "font-display mt-4 max-w-3xl text-[2.5rem] leading-[1.06] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[4rem]"
                        : "font-display mt-4 max-w-3xl text-[2.25rem] leading-[1.08] tracking-tight text-[var(--store-text)] sm:text-5xl lg:text-[3.75rem]"
                    }
                  >
                    {slide.headline}
                  </h1>
                  <p
                    className={
                      onPhoto
                        ? "mt-5 max-w-xl text-[15px] leading-relaxed text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] sm:text-[17px]"
                        : "mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--store-text-soft)] sm:text-[17px]"
                    }
                  >
                    {slide.body}
                  </p>
                  {slide.cta ? (
                    slide.cta.kind === "advisors" ? (
                      <button
                        type="button"
                        onClick={() => advisorsModal?.open()}
                        disabled={!advisorsModal?.hasAdvisors}
                        title={
                          advisorsModal?.hasAdvisors
                            ? undefined
                            : "Aún no hay asesores publicados."
                        }
                        className="store-btn-solid mt-7 inline-flex w-fit items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-medium disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {slide.cta.label}
                        <IconArrowRight className="h-[14px] w-[14px]" />
                      </button>
                    ) : (
                      <a
                        href={slide.cta.href}
                        className="store-btn-solid mt-7 inline-flex w-fit items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-medium"
                      >
                        {slide.cta.label}
                        <IconArrowRight className="h-[14px] w-[14px]" />
                      </a>
                    )
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(safeIndex - 1)}
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[var(--store-surface)]/85 text-[var(--store-text)] shadow-[var(--store-shadow-soft)] backdrop-blur transition hover:bg-[var(--store-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] sm:left-5"
              aria-label="Slide anterior"
            >
              <IconArrowLeft className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => go(safeIndex + 1)}
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[var(--store-surface)]/85 text-[var(--store-text)] shadow-[var(--store-shadow-soft)] backdrop-blur transition hover:bg-[var(--store-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] sm:right-5"
              aria-label="Siguiente slide"
            >
              <IconArrowRight className="h-[18px] w-[18px]" />
            </button>

            <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ir al slide ${i + 1}: ${slide.headline}`}
                  aria-current={i === safeIndex}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === safeIndex
                      ? "w-6 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
                      : "w-1.5 bg-white/45 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}