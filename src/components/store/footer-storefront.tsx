import { BrandLogo } from "@/components/store/brand-logo";
import {
  IconFacebook,
  IconGlobe,
  IconInstagram,
  IconTikTok,
} from "@/components/store/icons";
import { LegalModalsManager } from "@/components/store/legal-modals-manager";
import type {
  BrandConfig,
  StoreFooterConfig,
  StoreSocials,
} from "@/lib/store-types";

export type FooterStorefrontProps = {
  brand: Omit<BrandConfig, "homeHref">;
  footer: StoreFooterConfig;
  /**
   * Redes sociales reales que devuelve el backend. Si vienen vacías o nulas,
   * se hace fallback a `footer.socials` (defaults estáticos).
   */
  socials?: StoreSocials | null;
};

type SocialEntry = {
  id: string;
  label: string;
  href: string;
  rawValue: string;
};

function buildSocialEntries(
  apiSocials: StoreSocials | null | undefined,
  defaults: StoreFooterConfig["socials"],
): SocialEntry[] {
  const entries: SocialEntry[] = [];
  const trim = (v: string | null | undefined): string => (v ?? "").trim();

  const ig = trim(apiSocials?.instagram);
  const fb = trim(apiSocials?.facebook);
  const tt = trim(apiSocials?.tiktok);
  const web = trim(apiSocials?.website);

  if (ig) {
    const handle = ig
      .replace(/^@/, "")
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "");
    entries.push({
      id: "instagram",
      label: "Instagram",
      rawValue: ig,
      href: `https://instagram.com/${handle}`,
    });
  }

  if (fb) {
    const handle = fb.replace(/^https?:\/\/(www\.)?facebook\.com\//, "");
    entries.push({
      id: "facebook",
      label: "Facebook",
      rawValue: fb,
      href: /^https?:\/\//.test(fb)
        ? fb
        : `https://facebook.com/${handle}`,
    });
  }

  if (tt) {
    const handle = tt
      .replace(/^@/, "")
      .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, "");
    entries.push({
      id: "tiktok",
      label: "TikTok",
      rawValue: tt,
      href: `https://tiktok.com/@${handle}`,
    });
  }

  if (web) {
    entries.push({
      id: "website",
      label: "Sitio web",
      rawValue: web,
      href: /^https?:\/\//.test(web) ? web : `https://${web}`,
    });
  }

  if (entries.length > 0) return entries;

  // Fallback: defaults estáticos (modo sin backend)
  return defaults.map((s) => ({
    id: s.id,
    label: s.label,
    rawValue: s.href,
    href: s.href,
  }));
}

function SocialIcon({ id }: { id: string }) {
  const cls = "h-[18px] w-[18px]";
  switch (id) {
    case "instagram":
      return <IconInstagram className={cls} />;
    case "facebook":
      return <IconFacebook className={cls} />;
    case "tiktok":
      return <IconTikTok className={cls} />;
    case "website":
      return <IconGlobe className={cls} />;
    default:
      return null;
  }
}

/**
 * Footer multi-columna — equivalente sobrio al footer denso de macho.com.co.
 * Las redes se prefieren desde el backend (`store.socials`) y caen a los
 * defaults si la API no devuelve datos.
 */
export function FooterStorefront({
  brand,
  footer,
  socials,
}: FooterStorefrontProps) {
  const socialEntries = buildSocialEntries(socials, footer.socials);
  const hasSocials = socialEntries.length > 0;

  return (
    <footer className="mt-auto w-full border-t border-[var(--store-border)] bg-[var(--store-surface)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:px-10 2xl:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          {/* Brand column */}
          <div className="space-y-5">
            <BrandLogo {...brand} size="lg" className="max-w-[16rem]" />
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[var(--store-text)] sm:text-[15px]">
              Ruedas, llantas y respaldo experto en cada compra.
            </p>
            {hasSocials ? (
              <ul className="flex items-center gap-2 pt-2">
                {socialEntries.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      title={social.rawValue}
                      className="grid h-9 w-9 place-items-center rounded-full border border-[var(--store-border)] text-[var(--store-text-soft)] transition hover:border-[var(--store-primary)]/60 hover:text-[var(--store-primary)]"
                    >
                      <SocialIcon id={social.id} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Link columns */}
          {footer.columns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-text)]">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label + link.href}>
                    <a
                      href={link.href}
                      className="text-[13.5px] text-[var(--store-text-soft)] transition hover:text-[var(--store-primary)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--store-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--store-text-soft)]">
            {footer.copyright}
          </p>
          <LegalModalsManager links={footer.legalLinks} />
        </div>
      </div>
    </footer>
  );
}
