"use server";

import { defaultStoreConfig } from "@/config/store-defaults";
import type { ContactLine, PickupOption, StoreConfig } from "@/lib/store-types";

type StorePickupApi = {
  id: number;
  address: string;
  status: boolean;
};

type StoreApiResponse = {
  id: number;
  name: string;
  label: string | null;
  slug: string;
  phone: string | null;
  whatsapp: string | null;
  cellPhone: string | null;
  address: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  pickups: StorePickupApi[];
};

type ProductApiResponse = {
  id: number;
  storeId: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  active: boolean;
  availableQuantity: number;
  currency: string | null;
  createdAt: string;
};

function withoutMockProducts(config: StoreConfig): StoreConfig {
  return {
    ...config,
    catalog: {
      ...config.catalog,
      products: [],
    },
  };
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function toPhoneHref(value: string): string {
  const digits = digitsOnly(value);
  return `tel:+${digits}`;
}

function toWhatsAppHref(value: string): string {
  const digits = digitsOnly(value);
  return `https://wa.me/${digits}`;
}

function toMonogram(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return defaultStoreConfig.brand.monogram;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function mapContact(data: StoreApiResponse): StoreConfig["contact"] {
  const lines: ContactLine[] = [];

  if (data.whatsapp) {
    lines.push({
      icon: "whatsapp",
      label: data.whatsapp,
      href: toWhatsAppHref(data.whatsapp),
    });
  }

  const primaryPhone = data.phone ?? data.cellPhone;
  if (primaryPhone) {
    lines.push({
      icon: "phone",
      label: primaryPhone,
      href: toPhoneHref(primaryPhone),
    });
  }

  if (data.address) {
    lines.push({
      icon: "location",
      label: data.address,
    });
  }

  return {
    title: "Entra en contacto",
    lines: lines.length > 0 ? lines : defaultStoreConfig.contact.lines,
  };
}

function mapPickup(data: StoreApiResponse): StoreConfig["pickup"] {
  const active = (data.pickups ?? []).filter((pickup) => pickup.status);

  const options: PickupOption[] = active.map((pickup) => ({
    id: String(pickup.id),
    label: `Punto ${pickup.id}`,
    address: pickup.address,
  }));

  return {
    title: "Recogida",
    deliveryLabel: defaultStoreConfig.pickup.deliveryLabel,
    pickupLabel: defaultStoreConfig.pickup.pickupLabel,
    options: options.length > 0 ? options : defaultStoreConfig.pickup.options,
  };
}

function mergeTheme(data: StoreApiResponse): StoreConfig["theme"] {
  if (!data.primaryColor) return defaultStoreConfig.theme;
  return {
    ...defaultStoreConfig.theme,
    "--store-primary": data.primaryColor,
  };
}

function currencyToSymbol(currency: string | null | undefined): string {
  if (!currency) return "$";
  if (currency.toUpperCase() === "COP") return "$";
  return currency.toUpperCase();
}

function mapProducts(data: ProductApiResponse[]): StoreConfig["catalog"]["products"] {
  return data
    .filter((item) => item.active)
    .map((item) => ({
      id: String(item.id),
      title: item.name,
      imageSrc:
        item.imageUrl?.trim() ||
        "https://picsum.photos/seed/store-default-product/400/400",
      imageAlt: item.name,
      price: Number(item.price),
      currencySymbol: currencyToSymbol(item.currency),
      availableQuantity: Math.max(0, Number(item.availableQuantity ?? 0)),
      description: item.description ?? undefined,
      ref: `REF-${item.id}`,
    }));
}

export async function getStoreConfigFromApi(): Promise<StoreConfig> {
  const baseUrl = process.env.STORE_API_BASE_URL;
  const slug = process.env.STORE_API_SLUG ?? "01";

  if (!baseUrl) return withoutMockProducts(defaultStoreConfig);

  try {
    const sanitizedBaseUrl = baseUrl.replace(/\/$/, "");
    const storeEndpoint = `${sanitizedBaseUrl}/stores/${slug}`;
    const res = await fetch(storeEndpoint, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return withoutMockProducts(defaultStoreConfig);
    }

    const data = (await res.json()) as StoreApiResponse;
    const productsEndpoint = `${sanitizedBaseUrl}/stores/${slug}/products`;

    let catalogProducts: StoreConfig["catalog"]["products"] = [];
    try {
      const productsRes = await fetch(productsEndpoint, {
        method: "GET",
        cache: "no-store",
      });
      if (productsRes.ok) {
        const productsData = (await productsRes.json()) as ProductApiResponse[];
        catalogProducts = mapProducts(productsData);
      }
    } catch {
      // Keep empty catalog if products endpoint fails.
    }

    return {
      ...defaultStoreConfig,
      storeId: data.id,
      slug: data.slug,
      brand: {
        ...defaultStoreConfig.brand,
        monogram: toMonogram(data.name ?? defaultStoreConfig.brand.name),
        name: data.name ?? defaultStoreConfig.brand.name,
        tagline: data.label ?? defaultStoreConfig.brand.tagline,
        logoUrl: data.logoUrl,
      },
      contact: mapContact(data),
      pickup: mapPickup(data),
      theme: mergeTheme(data),
      catalog: {
        ...defaultStoreConfig.catalog,
        products: catalogProducts,
      },
    };
  } catch {
    return withoutMockProducts(defaultStoreConfig);
  }
}
