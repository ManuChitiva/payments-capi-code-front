import { ContactWidget } from "@/components/store/contact-widget";
import { PickupWidget } from "@/components/store/pickup-widget";
import type { StoreConfig } from "@/lib/store-types";

export type StoreSidebarProps = Pick<
  StoreConfig,
  "contact" | "pickup"
>;

export function StoreSidebar({ contact, pickup }: StoreSidebarProps) {
  return (
    <div className="space-y-4">
      <ContactWidget title={contact.title} lines={contact.lines} />
      <PickupWidget
        title={pickup.title}
        deliveryLabel={pickup.deliveryLabel}
        pickupLabel={pickup.pickupLabel}
        options={pickup.options}
      />
    </div>
  );
}
