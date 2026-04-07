import Link from "next/link";
import {
  IconLocation,
  IconPhone,
  IconWhatsApp,
} from "@/components/store/icons";
import { SidebarSection } from "@/components/store/sidebar-section";
import type { ContactLine } from "@/lib/store-types";

function ContactIcon({ icon }: { icon: ContactLine["icon"] }) {
  const c = "h-[18px] w-[18px] shrink-0 text-[var(--store-primary)]";
  if (icon === "whatsapp") return <IconWhatsApp className={c} />;
  if (icon === "phone") return <IconPhone className={c} />;
  return <IconLocation className={c} />;
}

export type ContactWidgetProps = {
  title: string;
  lines: ContactLine[];
};

export function ContactWidget({ title, lines }: ContactWidgetProps) {
  return (
    <SidebarSection title={title}>
      <ul className="flex flex-col gap-3.5">
        {lines.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-3.5 text-[14px] leading-snug text-[var(--store-text)]"
          >
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--store-border-subtle)] bg-[var(--store-muted)]/60">
              <ContactIcon icon={line.icon} />
            </span>
            <span className="min-w-0 pt-1.5">
              {line.href ? (
                <Link
                  href={line.href}
                  className="break-words font-medium underline decoration-[var(--store-border)] decoration-1 underline-offset-4 transition hover:text-[var(--store-primary)] hover:decoration-[var(--store-primary)]"
                >
                  {line.label}
                </Link>
              ) : (
                <span className="break-words">{line.label}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </SidebarSection>
  );
}
