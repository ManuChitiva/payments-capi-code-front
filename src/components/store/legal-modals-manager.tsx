"use client";

import { useCallback, useState } from "react";
import {
  dataTreatmentContent,
  privacyContent,
  termsContent,
} from "@/components/store/legal-content";
import { LegalModal } from "@/components/store/legal-modal";

export type LegalLink = { label: string; href: string };

type LegalKey = "privacy" | "terms" | "data";

/**
 * Mapea el href del link a la pieza de contenido del modal.
 * Mantiene compatibilidad con los hrefs actuales del config
 * (#privacidad, #terminos, #datos).
 */
function resolveLegalKey(href: string): LegalKey | null {
  const h = href.toLowerCase();
  if (h.includes("privacidad")) return "privacy";
  if (h.includes("terminos") || h.includes("términos")) return "terms";
  if (h.includes("datos")) return "data";
  return null;
}

function contentFor(key: LegalKey) {
  switch (key) {
    case "privacy":
      return privacyContent;
    case "terms":
      return termsContent;
    case "data":
      return dataTreatmentContent;
  }
}

/**
 * Renderiza los legalLinks como botones en lugar de anchors, y abre
 * el modal correspondiente. Vive como client component para manejar
 * el estado de qué modal está abierto.
 */
export function LegalModalsManager({ links }: { links: LegalLink[] }) {
  const [active, setActive] = useState<LegalKey | null>(null);

  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {links.map((link) => {
          const key = resolveLegalKey(link.href);
          if (!key) {
            // Si el href no corresponde a un modal conocido, fallback a anchor
            return (
              <li key={link.label + link.href}>
                <a
                  href={link.href}
                  className="text-[12px] text-[var(--store-text-soft)] transition hover:text-[var(--store-primary)]"
                >
                  {link.label}
                </a>
              </li>
            );
          }
          return (
            <li key={link.label + link.href}>
              <button
                type="button"
                onClick={() => setActive(key)}
                className="text-[12px] text-[var(--store-text-soft)] transition hover:text-[var(--store-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-surface)]"
              >
                {link.label}
              </button>
            </li>
          );
        })}
      </ul>

      <LegalModal
        open={active === "privacy"}
        onClose={close}
        title={privacyContent.title}
        intro={privacyContent.intro}
      >
        {privacyContent.body}
      </LegalModal>

      <LegalModal
        open={active === "terms"}
        onClose={close}
        title={termsContent.title}
        intro={termsContent.intro}
      >
        {termsContent.body}
      </LegalModal>

      <LegalModal
        open={active === "data"}
        onClose={close}
        title={dataTreatmentContent.title}
        intro={dataTreatmentContent.intro}
      >
        {dataTreatmentContent.body}
      </LegalModal>
    </>
  );
}
