"use client";

import { useState } from "react";
import { SidebarSection } from "@/components/store/sidebar-section";
import type { PickupOption } from "@/lib/store-types";

export type PickupWidgetProps = {
  title: string;
  deliveryLabel: string;
  pickupLabel: string;
  options: PickupOption[];
};

export function PickupWidget({
  title,
  deliveryLabel,
  pickupLabel,
  options,
}: PickupWidgetProps) {
  const [selected, setSelected] = useState(options[0]?.id ?? "");

  const current = options.find((o) => o.id === selected) ?? options[0];

  return (
    <SidebarSection title={title}>
      <div className="flex flex-col gap-4 text-[14px] leading-relaxed text-[var(--store-text)]">
        <p>
          <span className="font-medium text-[var(--store-text-soft)]">
            {deliveryLabel}
          </span>
          <span className="text-[var(--store-text-soft)]"> · </span>
          <span className="font-medium">A domicilio</span>
        </p>
        <div className="flex flex-col gap-2.5">
          <label
            className="text-[12px] font-semibold uppercase tracking-wider text-[var(--store-text-soft)]"
            htmlFor="pickup-point"
          >
            {pickupLabel}
          </label>
          <select
            id="pickup-point"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-[var(--store-border-subtle)] bg-[var(--store-muted)]/40 px-4 py-3 text-[14px] font-medium text-[var(--store-text)] shadow-inner outline-none transition focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-ring-focus)]"
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          {current?.address ? (
            <p className="rounded-xl border border-dashed border-[var(--store-border-subtle)] bg-[var(--store-muted)]/30 px-3 py-2.5 text-[13px] text-[var(--store-text-soft)]">
              {current.address}
            </p>
          ) : null}
        </div>
      </div>
    </SidebarSection>
  );
}
