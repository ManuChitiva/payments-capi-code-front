"use client";

import { useState } from "react";
import { IconArrowRight, IconEnvelope } from "@/components/store/icons";

export type NewsletterBandProps = {
  eyebrow?: string;
  headline: string;
  subline: string;
  ctaLabel: string;
  placeholder: string;
};

/**
 * Bloque de newsletter — equivalente elegante de "Se parte de nuestra
 * comunidad" de macho.com.co, reinterpretado como una sola pieza Apple-style
 * con copy sobrio y tipografía display.
 *
 * En este storefront el submit es demostrativo (no hay endpoint de email
 * marketing configurado); muestra confirmación optimista al pulsar.
 */
export function NewsletterBand({
  eyebrow = "Comunidad",
  headline,
  subline,
  ctaLabel,
  placeholder,
}: NewsletterBandProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative w-full"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
            {eyebrow}
          </p>
          <h2
            id="newsletter-heading"
            className="mt-3 font-display text-3xl tracking-tight text-[var(--store-text)] sm:text-[2.5rem]"
          >
            {headline}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--store-text-soft)] sm:text-[16px]">
            {subline}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex w-full max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            aria-label="Suscribirse al newsletter"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[var(--store-border)] bg-[var(--store-surface)] px-4 transition focus-within:border-[var(--store-primary)] focus-within:ring-2 focus-within:ring-[var(--store-ring-focus)]">
              <IconEnvelope className="h-[18px] w-[18px] shrink-0 text-[var(--store-text-soft)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                disabled={submitted}
                aria-label="Correo electrónico"
                className="min-w-0 flex-1 border-0 bg-transparent py-3 text-[14px] text-[var(--store-text)] outline-none placeholder:text-[var(--store-text-soft)] disabled:opacity-60"
              />
            </label>
            <button
              type="submit"
              disabled={submitted}
              className="store-btn-solid inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitted ? "¡Listo! Te escribiremos pronto." : ctaLabel}
              {!submitted ? (
                <IconArrowRight className="h-[14px] w-[14px]" />
              ) : null}
            </button>
          </form>

          <p className="mt-4 text-[12px] text-[var(--store-text-soft)]">
            Sin spam. Puedes darte de baja cuando quieras.
          </p>
        </div>
      </div>
    </section>
  );
}
