import Link from "next/link";
import {
  IconLocation,
  IconPhone,
  IconWhatsApp,
} from "@/components/store/icons";
import { SidebarSection } from "@/components/store/sidebar-section";
import type { ContactLine } from "@/lib/store-types";

function ContactIcon({ icon }: { icon: ContactLine["icon"] }) {
  const c = "h-[18px] w-[18px] shrink-0 text-[var(--store-text-soft)]";
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
      <ul className="flex flex-col divide-y divide-[var(--store-border)]">
        {lines.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-3 py-3 text-[14px] leading-snug text-[var(--store-text)] first:pt-0 last:pb-0"
          >
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center">
              <ContactIcon icon={line.icon} />
            </span>
            <span className="min-w-0 flex-1 self-center">
              {line.href ? (
                <Link
                  href={line.href}
                  className="break-words text-[var(--store-text)] transition hover:text-[var(--store-primary)]"
                >
                  {line.label}
                </Link>
              ) : (
                <span className="break-words text-[var(--store-text)]">
                  {line.label}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </SidebarSection>
  );
}
