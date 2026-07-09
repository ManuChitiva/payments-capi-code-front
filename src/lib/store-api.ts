"use server";

import { defaultStoreConfig } from "@/config/store-defaults";
import type {
  ContactLine,
  PickupOption,
  StoreAdvisor,
  StoreConfig,
  StoreProductVariant,
} from "@/lib/store-types";

type StorePickupApi = {
  id: number;
  address: string;
  status: boolean;
};

/**
 * Respuesta del endpoint `GET /stores/{slug}` (StoreDetail).
 * Refleja los campos públicos que expone el backend, incluyendo
 * redes sociales, descripción, horarios y métodos de pago.
 */
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
  coverImageUrl: string | null;
  description: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  schedule: string | null;
  paymentMethods: string | null;
  pickups: StorePickupApi[];
};

type ProductVariantApiResponse = {
  id: number;
  productId: number;
  sku: string;
  title: string;
  imageUrl: string | null;
  price: number;
  availableQuantity: number;
  active: boolean;
  sortOrder: number;
  createdAt: string;
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
  /** Vitrina pública solo envía variantes activas (filtradas en backend) */
  variants?: ProductVariantApiResponse[];
};

/**
 * Respuesta pública del endpoint `GET /stores/{slug}/personal`.
 * Espejo del DTO Java `PersonalMemberResponse`: solo expone los campos
 * visibles para que un cliente contacte al asesor.
 */
type AdvisorApiResponse = {
  id: number;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  photoUrl: string | null;
  active: boolean;
  sortOrder: number;
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
    options,
  };
}

function resolveTheme(): StoreConfig["theme"] {
  // La paleta de marca es local (ver `src/config/store-palette.ts`).
  // Se ignora `data.primaryColor` intencionalmente para mantener control
  // total sobre la identidad visual desde el código del storefront.
  return defaultStoreConfig.theme;
}

function currencyToSymbol(currency: string | null | undefined): string {
  if (!currency) return "$";
  if (currency.toUpperCase() === "COP") return "$";
  return currency.toUpperCase();
}

function mapVariant(
  v: ProductVariantApiResponse,
  parentId: string,
  fallbackCurrencySymbol: string,
  fallbackImageSrc: string,
): StoreProductVariant {
  return {
    id: String(v.id),
    productId: parentId,
    sku: v.sku,
    title: v.title,
    imageSrc: v.imageUrl?.trim() || fallbackImageSrc,
    imageAlt: v.title,
    price: Number(v.price),
    currencySymbol: fallbackCurrencySymbol,
    availableQuantity: Math.max(0, Number(v.availableQuantity ?? 0)),
    sortOrder: Number(v.sortOrder ?? 0),
  };
}

function mapProducts(data: ProductApiResponse[]): StoreConfig["catalog"]["products"] {
  return data
    .filter((item) => item.active)
    .map((item) => {
      const productId = String(item.id);
      const fallbackImageSrc =
        item.imageUrl?.trim() ||
        "https://picsum.photos/seed/store-default-product/400/400";
      const currencySymbol = currencyToSymbol(item.currency);
      const variants = (item.variants ?? [])
        .filter((v) => v.active)
        .map((v) =>
          mapVariant(v, productId, currencySymbol, fallbackImageSrc),
        )
        .sort(
          (a, b) =>
            a.sortOrder - b.sortOrder ||
            Number(a.id) - Number(b.id),
        );

      return {
        id: productId,
        title: item.name,
        imageSrc: fallbackImageSrc,
        imageAlt: item.name,
        price: Number(item.price),
        currencySymbol,
        availableQuantity: Math.max(0, Number(item.availableQuantity ?? 0)),
        description: item.description ?? undefined,
        ref: `REF-${item.id}`,
        variants,
      };
    });
}

/**
 * Mapea un asesor del backend al shape del storefront. Solo se exponen
 * asesores activos. Si no hay foto, se usa un avatar neutro generado
 * por seed (consistente para re-renders).
 */
function mapAdvisors(data: AdvisorApiResponse[]): StoreAdvisor[] {
  const active = data.filter((item) => item.active);
  return active
    .map((item) => ({
      sortOrder: Number(item.sortOrder ?? 0),
      advisor: {
        id: String(item.id),
        name: item.name?.trim() || "Asesor",
        photoSrc:
          item.photoUrl?.trim() ||
          `https://picsum.photos/seed/rs-asesor-api-${item.id}/240/240`,
        photoAlt: `Foto de ${item.name}`,
        whatsapp: item.whatsapp ?? undefined,
        phone: item.phone ?? undefined,
      },
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((entry) => entry.advisor);
}

export async function getStoreConfigFromApi(): Promise<StoreConfig> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const slug = process.env.NEXT_PUBLIC_STORE_API_SLUG?.trim() || "01";

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
    const advisorsEndpoint = `${sanitizedBaseUrl}/stores/${slug}/personal`;

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

    // Asesores: si el endpoint público responde 2xx, lo usamos (incluso si
    // la lista viene vacía — el merchant podría no haber publicado ninguno).
    // Si falla (404 hasta que se exponga el endpoint, error de red, etc.),
    // caemos al seed de `defaultStoreConfig.advisors` para que el modal
    // del slide "Asesoría" siga siendo funcional durante el desarrollo.
    let advisors: StoreAdvisor[] | undefined;
    try {
      const advisorsRes = await fetch(advisorsEndpoint, {
        method: "GET",
        cache: "no-store",
      });
      if (advisorsRes.ok) {
        const advisorsData = (await advisorsRes.json()) as AdvisorApiResponse[];
        advisors = mapAdvisors(advisorsData);
      }
    } catch {
      // Network error: keep `undefined` to trigger seed fallback below.
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
      socials: {
        instagram: data.instagram ?? null,
        facebook: data.facebook ?? null,
        tiktok: data.tiktok ?? null,
        website: data.website ?? null,
      },
      profile: {
        description: data.description ?? null,
        email: data.email ?? null,
        website: data.website ?? null,
        schedule: data.schedule ?? null,
        paymentMethods: data.paymentMethods ?? null,
        coverImageUrl: data.coverImageUrl ?? null,
      },
      theme: resolveTheme(),
      catalog: {
        ...defaultStoreConfig.catalog,
        products: catalogProducts,
      },
      advisors: advisors ?? defaultStoreConfig.advisors ?? [],
    };
  } catch {
    return withoutMockProducts(defaultStoreConfig);
  }
}
