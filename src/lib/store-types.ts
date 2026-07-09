import type { CSSProperties } from "react";

export type NavLinkItem = {
  label: string;
  href: string;
  /**
   * `kind` permite distinguir un link ancla normal (`"link"`, default)
   * de uno que dispara una acción de UI — actualmente solo `"advisors"`
   * abre el modal de asesores en lugar de hacer scroll.
   */
  kind?: "link" | "advisors";
};

export type BrandConfig = {
  monogram: string;
  name: string;
  tagline?: string;
  /** When set, shows image alongside or instead of monogram text */
  logoUrl?: string | null;
  homeHref?: string;
};

/**
 * Redes sociales de la tienda. Cada campo es el handle o URL completa
 * (depende del merchant); se renderiza como href hacia la red si es handle
 * o como link absoluto si ya es URL.
 */
export type StoreSocials = {
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  website?: string | null;
};

/**
 * Datos de contacto / perfil extra de la tienda. Provistos por el backend
 * (`/stores/{slug}`); el frontend los trata como opcionales.
 */
export type StoreProfile = {
  description?: string | null;
  email?: string | null;
  website?: string | null;
  schedule?: string | null;
  paymentMethods?: string | null;
  /** URL de la imagen de portada, útil como hero */
  coverImageUrl?: string | null;
};

/**
 * Llamada a la acción del hero. `anchor` apunta a un id de la página (ej. "#productos").
 */
export type StoreHeroCta = {
  label: string;
  anchor: string;
};

/**
 * Bloque principal (hero) de la landing. `headline` admite `*palabra*` para resaltar
 * segmentos con el color primario de marca.
 */
export type StoreHero = {
  eyebrow: string;
  headline: string;
  subline?: string;
  primaryCta: StoreHeroCta;
  secondaryCta?: StoreHeroCta;
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
  /** Cantidad disponible en inventario */
  availableQuantity?: number;
  /** SKU o referencia para mostrar en ficha / modal */
  ref?: string;
  /** Descripción larga (modal o futura página de detalle) */
  description?: string;
  /** Variantes del producto (color, talla, presentación…). Vacío/ausente = producto simple. */
  variants?: StoreProductVariant[];
};

/**
 * Variante de un producto (color, talla, etc.). Una unidad seleccionable del catálogo.
 * Si el producto tiene variantes, el comprador debe elegir una antes de añadir al carrito.
 */
export type StoreProductVariant = {
  id: string;
  /** Id del producto padre (referencia informativa) */
  productId: string;
  sku: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  /** Precio propio de la variante. Si difiere del producto, se usa este. */
  price: number;
  currencySymbol: string;
  availableQuantity: number;
  sortOrder: number;
};

export type StoreSortOption = {
  id: string;
  label: string;
};

/**
 * Call-to-action de un slide del hero. Puede ser un link ancla clásico
 * (`kind: "link"`) o disparar el modal de asesores (`kind: "advisors"`).
 */
export type StoreHeroCtaAction =
  | { kind: "link"; href: string }
  | { kind: "advisors" };

export type StoreHeroSlideCta = {
  label: string;
} & StoreHeroCtaAction;

/**
 * Slide individual del carrusel del hero (estilo Apple keynote).
 * Si tiene `cta`, renderiza el botón a la derecha del eyebrow.
 * Si tiene `image`, se usa como background full-bleed del slide;
 * si no, se usa la `image` que llega a nivel del carrusel como fallback.
 */
export type StoreHeroSlide = {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  cta?: StoreHeroSlideCta;
  /** Tono de fondo del slide — solo se aplica si NO hay imagen */
  tone: "neutral" | "warm" | "cool" | "subtle";
  /** Imagen full-bleed opcional para este slide (p.ej. foto publicitaria del API) */
  image?: { src: string; alt: string };
};

/**
 * Asesor comercial de la tienda. Se muestra dentro del modal que se
 * abre al pulsar el CTA "advisors" del slide de Asesoría del hero.
 * `whatsapp` y `phone` admiten números crudos (con o sin '+') — el modal
 * se encarga de armar los href correctos.
 */
export type StoreAdvisor = {
  id: string;
  name: string;
  /** Cargo o especialidad (opcional) */
  role?: string;
  /** URL de la foto del asesor (avatar cuadrado recomendado) */
  photoSrc: string;
  /** Texto alternativo para la foto */
  photoAlt?: string;
  /** Número de WhatsApp (en formato E.164 sin '+' o con '+') */
  whatsapp?: string;
  /** Número de teléfono (en formato E.164 sin '+' o con '+') */
  phone?: string;
};

/**
 * Tarjeta de servicio/beneficio. Inspirada en los "trust signals" de macho.com.co,
 * reinterpretada como bloques Apple-style: ícono, título, descripción.
 */
export type StoreServiceTile = {
  id: string;
  icon: "shipping" | "shield" | "support" | "install" | "warranty";
  title: string;
  description: string;
};

/**
 * Bloque inferior del hero: enlaces a recursos (blog, distribuidores, etc.),
 * equivalente elegante de los footer-banners de macho.com.co.
 */
export type StoreResourceTile = {
  id: string;
  title: string;
  description: string;
  href: string;
};

/**
 * Mini-stat inline (años, clientes, tiempo de envío…)
 * Aparece debajo del hero como una fila de números breves.
 */
export type StoreStat = {
  id: string;
  value: string;
  label: string;
};

/**
 * Bloque "Cómo funciona" — pasos numerados del proceso de compra.
 */
export type StoreProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
};

/**
 * Testimonio de cliente — usado en la banda editorial de quotes.
 */
export type StoreTestimonial = {
  id: string;
  quote: string;
  name: string;
  role?: string;
};

/**
 * Colección destacada — equivale a "FeaturedCollections" en la nueva portada.
 * Bloque grande con imagen dominante para 3 categorías top.
 */
export type StoreFeaturedCollection = {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

/**
 * Categoría destacada para el strip visual de la home (CategoryStrip).
 * Cada tarjeta es un enlace a una sección/ruta del catálogo.
 */
export type StoreFeaturedCategory = {
  id: string;
  name: string;
  imageSrc: string;
  /** Enlace de la categoría. Si se omite, el componente usa fallbackHref. */
  href?: string;
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
  /** Numeric store id from STORE API (checkout / PayU) */
  storeId?: number;
  /** Store slug used in STORE API paths */
  slug?: string;
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
  /** Redes sociales — si están, el footer las renderiza desde aquí */
  socials?: StoreSocials;
  /** Datos de perfil extendidos (descripción, email, horarios…) */
  profile?: StoreProfile;
  catalog: {
    sortLabel: string;
    sortOptions: StoreSortOption[];
    products: StoreProduct[];
    /** Etiqueta pequeña sobre el título (ej. “Tienda online”) */
    eyebrow?: string;
    /** Título principal del bloque de catálogo */
    headline?: string;
    /** Texto de apoyo bajo el título */
    subline?: string;
  };
  /** Slides del hero — si está vacío, el home no muestra carrusel */
  heroSlides?: StoreHeroSlide[];
  /** Asesores comerciales — listados en el modal que abre el CTA "Asesoría" */
  advisors?: StoreAdvisor[];
  /** Categorías destacadas del strip — si está vacío, el strip se omite */
  featuredCategories?: StoreFeaturedCategory[];
  /** Colecciones destacadas — bloque editorial grande en la portada */
  featuredCollections?: StoreFeaturedCollection[];
  /** Bloque de servicios/beneficios (envíos, garantía, soporte…) */
  services?: StoreServiceTile[];
  /** Banda de recursos: blog, distribuidores, catálogo, etc. */
  resources?: StoreResourceTile[];
  /** Estadísticas inline del hero (años, clientes, etc.) */
  heroStats?: StoreStat[];
  /** Imagen del hero — null = solo tipografía centrada */
  heroImage?: {
    src: string;
    alt: string;
  };
  /** Copy del bloque "Cómo funciona" */
  process?: {
    eyebrow: string;
    headline: string;
    subline: string;
    steps: StoreProcessStep[];
  };
  /** Testimonios — bloque editorial con quotes de clientes */
  testimonials?: {
    eyebrow: string;
    headline: string;
    items: StoreTestimonial[];
  };
  /** Copy del bloque de newsletter */
  newsletter?: {
    eyebrow: string;
    headline: string;
    subline: string;
    ctaLabel: string;
    placeholder: string;
  };
  /** Columnas del footer. Si se omite, se usan los defaults */
  footer?: StoreFooterConfig;
  /** Sobrescribe variables CSS concretas (colores de marca por tienda) */
  theme?: Partial<StoreThemeVars>;
};

export type StoreFooterColumn = {
  title: string;
  links: NavLinkItem[];
};

export type StoreFooterConfig = {
  columns: StoreFooterColumn[];
  copyright: string;
  legalLinks: NavLinkItem[];
  socials: { id: string; label: string; href: string }[];
};

export function themeToStyle(theme: Partial<StoreThemeVars>): CSSProperties {
  return theme as unknown as CSSProperties;
}
