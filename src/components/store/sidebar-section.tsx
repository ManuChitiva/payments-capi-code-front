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
      className={`rounded-xl border border-[var(--store-border)] bg-[var(--store-surface)] ${className}`}
    >
      <div className="p-5 sm:p-6">
        <h2 className="mb-4 text-[13px] font-medium text-[var(--store-text-soft)]">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
