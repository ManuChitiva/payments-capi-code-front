import type { StoreTestimonial } from "@/lib/store-types";

export type TestimonialsBandProps = {
  eyebrow?: string;
  headline: string;
  items: StoreTestimonial[];
};

/**
 * Banda de testimonios — 3 quotes de clientes con tipografía display,
 * comillas decorativas grandes y un pequeño rating visual.
 */
export function TestimonialsBand({
  eyebrow = "Testimonios",
  headline,
  items,
}: TestimonialsBandProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative w-full overflow-hidden text-white"
    >
      {/* Background image */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://estructuramex.com/wp-content/uploads/2021/10/Tipos-de-bodega.jpg')",
        }}
      />
      {/* Multi-stop dark overlay for legibility */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85"
      />
      {/* Subtle primary tint, blended in for a premium feel */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[var(--store-primary)]/10 mix-blend-overlay"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">
        <header className="mb-10 max-w-2xl space-y-3 sm:mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/85">
            {eyebrow}
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-3xl tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
          >
            {headline}
          </h2>
        </header>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {items.map((testimonial) => (
            <li
              key={testimonial.id}
              className="store-lift group flex h-full flex-col gap-5 rounded-2xl border border-white/15 bg-[var(--store-surface)] p-6 shadow-xl shadow-black/40 ring-1 ring-black/5 hover:border-[var(--store-primary)]/50 hover:shadow-[0_45px_80px_-20px_rgba(0,0,0,0.75)] hover:ring-[var(--store-primary)]/30 sm:p-7"
            >
              {/* Decorative quote */}
              <span
                aria-hidden
                className="font-display text-[4rem] leading-none tracking-tight text-[var(--store-primary)]/25 transition-[transform,color] duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--store-primary)]/45"
              >
                “
              </span>

              <blockquote className="-mt-3 flex-1">
                <p className="text-[15px] leading-relaxed text-[var(--store-text)] sm:text-[15.5px]">
                  {testimonial.quote}
                </p>
              </blockquote>

              {/* Star rating */}
              <div
                className="flex items-center gap-0.5 text-[var(--store-primary)]"
                aria-label="Calificación 5 de 5"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} active={i < 5} />
                ))}
              </div>

              <footer className="flex items-center gap-3 border-t border-[var(--store-border)]/80 pt-4">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--store-muted)] text-[12px] font-semibold text-[var(--store-text)]"
                  aria-hidden
                >
                  {initials(testimonial.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold tracking-tight text-[var(--store-text)]">
                    {testimonial.name}
                  </p>
                  {testimonial.role ? (
                    <p className="text-[12px] text-[var(--store-text-soft)]">
                      {testimonial.role}
                    </p>
                  ) : null}
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Star({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={active ? "opacity-100" : "opacity-30"}
      aria-hidden
    >
      <path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
    </svg>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
