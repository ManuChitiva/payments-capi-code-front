import {
  IconChat,
  IconEnvelope,
  IconGlobe,
  IconLocation,
} from "@/components/store/icons";
import type { StoreProfile } from "@/lib/store-types";

export type ProfileBandProps = {
  profile: StoreProfile;
  /** Una sola frase de presentación sobre la tienda */
  eyebrow?: string;
  headline?: string;
};

/**
 * Banda "Sobre la tienda" — sólo se muestra si el backend provee al menos
 * un campo útil del perfil (descripción, email, sitio web, horario,
 * métodos de pago).
 *
 * Renderiza la descripción y 1-4 mini-tarjetas con el resto de datos.
 */
export function ProfileBand({
  profile,
  eyebrow = "Sobre la tienda",
  headline = "Lo que nos mueve.",
}: ProfileBandProps) {
  const description = profile.description?.trim() ?? "";
  const email = profile.email?.trim() ?? "";
  const website = profile.website?.trim() ?? "";
  const schedule = profile.schedule?.trim() ?? "";
  const paymentMethods = profile.paymentMethods?.trim() ?? "";

  const hasContent =
    !!description ||
    !!email ||
    !!website ||
    !!schedule ||
    !!paymentMethods;

  if (!hasContent) return null;

  const websiteHref = website
    ? /^https?:\/\//.test(website)
      ? website
      : `https://${website}`
    : "";

  return (
    <section
      aria-labelledby="profile-heading"
      className="relative w-full border-y border-[var(--store-border)] bg-[var(--store-page-bg)]"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">
        <div className="space-y-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
            {eyebrow}
          </p>
          <h2
            id="profile-heading"
            className="font-display text-3xl tracking-tight text-[var(--store-text)] sm:text-4xl lg:text-[2.75rem]"
          >
            {headline}
          </h2>
          {description ? (
            <p className="max-w-xl whitespace-pre-line break-words text-[15px] leading-relaxed text-[var(--store-text-soft)] sm:text-[16px]">
              {description}
            </p>
          ) : null}
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {schedule ? (
            <ProfileTile
              icon={<IconChat className="h-5 w-5" />}
              label="Horario"
              value={schedule}
            />
          ) : null}
          {paymentMethods ? (
            <ProfileTile
              icon={<IconLocation className="h-5 w-5" />}
              label="Pagos"
              value={paymentMethods}
            />
          ) : null}
          {email ? (
            <ProfileTile
              icon={<IconEnvelope className="h-5 w-5" />}
              label="Email"
              value={email}
              href={`mailto:${email}`}
            />
          ) : null}
          {website ? (
            <ProfileTile
              icon={<IconGlobe className="h-5 w-5" />}
              label="Sitio web"
              value={website}
              href={websiteHref}
            />
          ) : null}
        </ul>
      </div>
    </section>
  );
}

function ProfileTile({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="store-lift flex h-full flex-col gap-3 rounded-2xl border border-[var(--store-border)] bg-[var(--store-surface)] p-5 shadow-md shadow-black/5 ring-1 ring-black/[0.03] hover:border-[var(--store-primary)]/45 hover:shadow-xl hover:shadow-black/10 hover:ring-[var(--store-primary)]/20 sm:p-6">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--store-primary)]/12 text-[var(--store-primary)] transition-transform duration-300 ease-out group-hover:scale-110">
        {icon}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--store-text-soft)]">
        {label}
      </span>
      <span className="text-[14px] leading-snug text-[var(--store-text)] sm:text-[15px]">
        {value}
      </span>
    </div>
  );

  if (href) {
    return (
      <li className="group">
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
          className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--store-ring-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--store-page-bg)]"
        >
          {inner}
        </a>
      </li>
    );
  }

  return <li className="group">{inner}</li>;
}
