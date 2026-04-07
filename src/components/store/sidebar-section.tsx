export type SidebarSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function SidebarSection({
  title,
  children,
  className = "",
}: SidebarSectionProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-[var(--store-border-subtle)] bg-[var(--store-surface)] shadow-[var(--store-shadow-soft)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--store-muted)]/50 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative p-5 sm:p-6">
        <h2 className="mb-5 border-b border-[var(--store-border-subtle)] pb-4">
          <span className="font-display text-xl tracking-tight text-[var(--store-primary)]">
            {title}
          </span>
        </h2>
        {children}
      </div>
    </section>
  );
}
