import type { CSSProperties } from "react";

export type NavLinkItem = {
  label: string;
  href: string;
};

export type BrandConfig = {
  monogram: string;
  name: string;
  tagline?: string;
  /** When set, shows image alongside or instead of monogram text */
  logoUrl?: string | null;
  homeHref?: string;
};

export type ContactLine = {
  icon: "whatsapp" | "phone" | "location";
  label: string;
  href?: string;
};

export type PickupOption = {
  id: string;
  label: string;
  address?: string;
};

export type StoreProduct = {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  price: number;
  currencySymbol: string;
};

export type StoreSortOption = {
  id: string;
  label: string;
};

export type StoreThemeVars = {
  "--store-primary": string;
  "--store-primary-hover": string;
  "--store-nav-bg": string;
  "--store-page-bg": string;
  "--store-surface": string;
  "--store-muted": string;
  "--store-border": string;
  "--store-text": string;
  "--store-text-soft": string;
  "--store-badge": string;
};

export type StoreConfig = {
  brand: BrandConfig;
  navLinks: NavLinkItem[];
  contact: {
    title: string;
    lines: ContactLine[];
  };
  pickup: {
    title: string;
    deliveryLabel: string;
    pickupLabel: string;
    options: PickupOption[];
  };
  catalog: {
    sortLabel: string;
    sortOptions: StoreSortOption[];
    products: StoreProduct[];
    /** Título principal del bloque de catálogo */
    headline?: string;
    /** Texto de apoyo bajo el título */
    subline?: string;
  };
  /** Sobrescribe variables CSS concretas (colores de marca por tienda) */
  theme?: Partial<StoreThemeVars>;
};

export function themeToStyle(theme: Partial<StoreThemeVars>): CSSProperties {
  return theme as unknown as CSSProperties;
}
