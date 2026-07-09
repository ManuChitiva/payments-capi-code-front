import type { StoreConfig } from "@/lib/store-types";
import { storePalette } from "@/config/store-palette";

/** Demo configuration: replace or load per-tenant in production */
export const defaultStoreConfig: StoreConfig = {
  brand: {
    monogram: "RS",
    name: "Ruedas y Soluciones",
    tagline: "Tu confianza en nuestras manos",
    logoUrl: null,
    homeHref: "/",
  },
  navLinks: [
    { label: "Inicio", href: "/" },
    { label: "Catálogo", href: "#productos" },
    { label: "Asesoría", href: "#contacto", kind: "advisors" },
    { label: "Blog", href: "#blog" },
  ],
  contact: {
    title: "Entra en contacto",
    lines: [
      {
        icon: "whatsapp",
        label: "+57 300 000 0000",
        href: "https://wa.me/573000000000",
      },
      { icon: "phone", label: "+57 (601) 000 0000", href: "tel:+576010000000" },
      {
        icon: "location",
        label: "Calle 00 #00-00, Bogotá",
      },
    ],
  },
  pickup: {
    title: "Recogida",
    deliveryLabel: "Entrega",
    pickupLabel: "Recogida",
    options: [],
  },
  /**
   * Tema derivado de `storePalette`. Se aplica como inline style en el layout
   * raíz de cada página. Si en el futuro se quiere exponer más variables al
   * config, ampliar `StoreThemeVars` y mapear aquí.
   */
  theme: {
    "--store-primary": storePalette.primary,
    "--store-primary-hover": storePalette.primaryHover,
    "--store-badge": storePalette.badge,
  },
  catalog: {
    eyebrow: "Tienda online",
    headline: "Todo lo que buscas, en un solo lugar",
    subline:
      "Navega por nuestros productos, compara y elige con calma. Compra de forma rápida y segura; estamos aquí para ayudarte cuando lo necesites.",
    sortLabel: "Más relevante",
    sortOptions: [
      { id: "relevant", label: "Más relevante" },
      { id: "price-asc", label: "Menor precio" },
      { id: "price-desc", label: "Mayor precio" },
    ],
    products: [
      {
        id: "1",
        title: "Neumático touring 195/65 R15 91H",
        imageSrc: "https://picsum.photos/seed/rs-p1/400/400",
        imageAlt: "Neumático touring",
        price: 289000,
        currencySymbol: "$",
        ref: "SKU-TYR-195651591H",
        description:
          "Neumático touring para uso urbano y carretera. Buen equilibrio entre confort, duración y consumo. Verifica compatibilidad con tu vehículo antes de comprar.",
        variants: [
          {
            id: "v1-rojo",
            productId: "1",
            sku: "TYR-195-ROJO",
            title: "Línea Roja",
            imageSrc: "https://picsum.photos/seed/rs-p1-rojo/400/400",
            imageAlt: "Neumático touring — línea roja",
            price: 289000,
            currencySymbol: "$",
            availableQuantity: 8,
            sortOrder: 0,
          },
          {
            id: "v1-negro",
            productId: "1",
            sku: "TYR-195-NEGRO",
            title: "Línea Negra",
            imageSrc: "https://picsum.photos/seed/rs-p1-negro/400/400",
            imageAlt: "Neumático touring — línea negra",
            price: 305000,
            currencySymbol: "$",
            availableQuantity: 4,
            sortOrder: 1,
          },
          {
            id: "v1-premium",
            productId: "1",
            sku: "TYR-195-PREMIUM",
            title: "Edición Premium",
            imageSrc: "https://picsum.photos/seed/rs-p1-premium/400/400",
            imageAlt: "Neumático touring — edición premium",
            price: 349000,
            currencySymbol: "$",
            availableQuantity: 0,
            sortOrder: 2,
          },
        ],
      },
      {
        id: "2",
        title: "Neumático SUV 225/60 R17 99V",
        imageSrc: "https://picsum.photos/seed/rs-p2/400/400",
        imageAlt: "Neumático SUV",
        price: 425000,
        currencySymbol: "$",
      },
      {
        id: "3",
        title: 'Llanta de aleación 16" 5×114.3 grafito',
        imageSrc: "https://picsum.photos/seed/rs-p3/400/400",
        imageAlt: "Llanta de aleación",
        price: 512000,
        currencySymbol: "$",
      },
      {
        id: "4",
        title: 'Llanta de acero 15" con tapón',
        imageSrc: "https://picsum.photos/seed/rs-p4/400/400",
        imageAlt: "Llanta de acero",
        price: 198000,
        currencySymbol: "$",
      },
      {
        id: "5",
        title: "Kit sensores TPMS (4 unidades)",
        imageSrc: "https://picsum.photos/seed/rs-p5/400/400",
        imageAlt: "Sensores TPMS",
        price: 156000,
        currencySymbol: "$",
      },
      {
        id: "6",
        title: "Cadena de nieve textil talla M",
        imageSrc: "https://picsum.photos/seed/rs-p6/400/400",
        imageAlt: "Cadenas de nieve",
        price: 89000,
        currencySymbol: "$",
      },
      {
        id: "7",
        title: "Compresor portátil 12V digital",
        imageSrc: "https://picsum.photos/seed/rs-p7/400/400",
        imageAlt: "Compresor portátil",
        price: 124000,
        currencySymbol: "$",
      },
      {
        id: "8",
        title: "Kit reparación pinchazos emergencia",
        imageSrc: "https://picsum.photos/seed/rs-p8/400/400",
        imageAlt: "Kit reparación pinchazos",
        price: 45900,
        currencySymbol: "$",
      },
      {
        id: "9",
        title: "Aceite motor sintético 5W-30 4 L",
        imageSrc: "https://picsum.photos/seed/rs-p9/400/400",
        imageAlt: "Aceite motor",
        price: 98500,
        currencySymbol: "$",
      },
      {
        id: "10",
        title: "Filtro de aceite cartucho universal",
        imageSrc: "https://picsum.photos/seed/rs-p10/400/400",
        imageAlt: "Filtro de aceite",
        price: 22800,
        currencySymbol: "$",
      },
      {
        id: "11",
        title: "Pastillas de freno delanteras cerámicas",
        imageSrc: "https://picsum.photos/seed/rs-p11/400/400",
        imageAlt: "Pastillas de freno",
        price: 178000,
        currencySymbol: "$",
      },
      {
        id: "12",
        title: "Discos de freno ventilados par",
        imageSrc: "https://picsum.photos/seed/rs-p12/400/400",
        imageAlt: "Discos de freno",
        price: 265000,
        currencySymbol: "$",
      },
      {
        id: "13",
        title: "Batería 12V 60 Ah 540 A arranque",
        imageSrc: "https://picsum.photos/seed/rs-p13/400/400",
        imageAlt: "Batería automotriz",
        price: 342000,
        currencySymbol: "$",
      },
      {
        id: "14",
        title: 'Escobillas limpiaparabrisas 24" / 18"',
        imageSrc: "https://picsum.photos/seed/rs-p14/400/400",
        imageAlt: "Escobillas limpiaparabrisas",
        price: 38900,
        currencySymbol: "$",
      },
      {
        id: "15",
        title: "Líquido refrigerante concentrado 1 L",
        imageSrc: "https://picsum.photos/seed/rs-p15/400/400",
        imageAlt: "Refrigerante",
        price: 24900,
        currencySymbol: "$",
      },
      {
        id: "16",
        title: "Alfombras de goma a medida juego 4",
        imageSrc: "https://picsum.photos/seed/rs-p16/400/400",
        imageAlt: "Alfombras de goma",
        price: 112000,
        currencySymbol: "$",
      },
      {
        id: "17",
        title: "Portaequipajes de techo barras aluminio",
        imageSrc: "https://picsum.photos/seed/rs-p17/400/400",
        imageAlt: "Portaequipajes",
        price: 389000,
        currencySymbol: "$",
      },
      {
        id: "18",
        title: "Cámara de reversa HD con guías",
        imageSrc: "https://picsum.photos/seed/rs-p18/400/400",
        imageAlt: "Cámara de reversa",
        price: 95000,
        currencySymbol: "$",
      },
      {
        id: "19",
        title: "Cargador USB-C + USB doble 12V",
        imageSrc: "https://picsum.photos/seed/rs-p19/400/400",
        imageAlt: "Cargador coche",
        price: 31500,
        currencySymbol: "$",
      },
      {
        id: "20",
        title: "Organizador maletero plegable",
        imageSrc: "https://picsum.photos/seed/rs-p20/400/400",
        imageAlt: "Organizador maletero",
        price: 67900,
        currencySymbol: "$",
      },
      {
        id: "21",
        title: "Cubiertas de asiento premium negro",
        imageSrc: "https://picsum.photos/seed/rs-p21/400/400",
        imageAlt: "Cubiertas de asiento",
        price: 145000,
        currencySymbol: "$",
      },
      {
        id: "22",
        title: "Ambientador clip ventilación vainilla",
        imageSrc: "https://picsum.photos/seed/rs-p22/400/400",
        imageAlt: "Ambientador",
        price: 12900,
        currencySymbol: "$",
      },
      {
        id: "23",
        title: "Gato hidráulico carrito 2 toneladas",
        imageSrc: "https://picsum.photos/seed/rs-p23/400/400",
        imageAlt: "Gato hidráulico",
        price: 198000,
        currencySymbol: "$",
      },
      {
        id: "24",
        title: 'Llave de cruz reforzada 17"–19"–21"–23"',
        imageSrc: "https://picsum.photos/seed/rs-p24/400/400",
        imageAlt: "Llave de cruz",
        price: 87500,
        currencySymbol: "$",
      },
    ],
  },
  /**
   * Imagen del hero editorial. Reemplazar con foto real del producto estrella.
   */
  heroImage: {
    src: "https://picsum.photos/seed/rs-hero-tire/1400/900",
    alt: "Neumático premium sobre fondo neutro",
  },
  /**
   * Stats inline del hero — números cortos que aparecen debajo del CTA.
   */
  heroStats: [
    { id: "anios", value: "10+", label: "Años en el mercado" },
    { id: "clientes", value: "5.000+", label: "Clientes felices" },
    { id: "envio", value: "24-48h", label: "Envío a domicilio" },
    { id: "garantia", value: "100%", label: "Productos originales" },
  ],
  /**
   * Slides del hero — estilo Apple keynote: tipografía grande, movimiento
   * sutil, copy enfocado. Reordenables desde este array.
   * El CTA del slide de Asesoría abre el modal de asesores
   * (kind: "advisors") en lugar de un link ancla.
   */
  heroSlides: [
    {
      id: "slide-neumaticos",
      eyebrow: "Neumáticos",
      headline: "El neumático correcto para cada camino.",
      body: "Asesoría técnica para encontrar la medida, el índice de carga y el compuesto ideal para tu vehículo y tu forma de conducir.",
      cta: { label: "Ver catálogo", kind: "link", href: "#productos" },
      tone: "neutral",
    },
    {
      id: "slide-llantas",
      eyebrow: "Llantas",
      headline: "Llantas premium, instaladas con precisión.",
      body: "Acero y aleación en todas las medidas populares. Equilibrado, montaje y alineación incluidos con cada juego.",
      cta: { label: "Explorar llantas", kind: "link", href: "#productos" },
      tone: "warm",
    },
    {
      id: "slide-expertos",
      eyebrow: "Asesoría",
      headline: "Habla directo con un experto.",
      body: "Te ayudamos a comparar referencias, validar compatibilidad y resolver dudas por WhatsApp en minutos.",
      cta: { label: "Ver asesores", kind: "advisors" },
      tone: "cool",
    },
  ],
  /**
   * Asesores comerciales — se listan dentro del modal que abre el slide
   * "Asesoría" del hero. Las fotos usan picsum con seeds estables para que
   * el demo luzca coherente; reemplázalas por fotos reales del equipo.
   */
  advisors: [
    {
      id: "asesor-1",
      name: "Carlos Ramírez",
      role: "Especialista en neumáticos",
      photoSrc: "https://picsum.photos/seed/rs-asesor-1/240/240",
      photoAlt: "Foto de Carlos Ramírez",
      whatsapp: "+57 300 123 4567",
      phone: "+57 601 123 4567",
    },
    {
      id: "asesor-2",
      name: "María Fernández",
      role: "Asesora de llantas y frenos",
      photoSrc: "https://picsum.photos/seed/rs-asesor-2/240/240",
      photoAlt: "Foto de María Fernández",
      whatsapp: "+57 310 234 5678",
      phone: "+57 601 234 5678",
    },
    {
      id: "asesor-3",
      name: "Andrés Pérez",
      role: "Atención a flotas corporativas",
      photoSrc: "https://picsum.photos/seed/rs-asesor-3/240/240",
      photoAlt: "Foto de Andrés Pérez",
      whatsapp: "+57 315 345 6789",
      phone: "+57 601 345 6789",
    },
    {
      id: "asesor-4",
      name: "Laura Gómez",
      role: "Asesoría general y repuestos",
      photoSrc: "https://picsum.photos/seed/rs-asesor-4/240/240",
      photoAlt: "Foto de Laura Gómez",
      whatsapp: "+57 320 456 7890",
      phone: "+57 601 456 7890",
    },
  ],
  /**
   * Categorías destacadas del strip. Las imágenes usan picsum.placeholder
   * con seeds estables; reemplázalas con las fotos reales del catálogo.
   */
  featuredCategories: [
    {
      id: "neumaticos",
      name: "Neumáticos",
      imageSrc: "https://picsum.photos/seed/rs-cat-neumaticos/640/640",
      href: "#productos",
    },
    {
      id: "llantas",
      name: "Llantas",
      imageSrc: "https://picsum.photos/seed/rs-cat-llantas/640/640",
      href: "#productos",
    },
    {
      id: "frenos",
      name: "Frenos",
      imageSrc: "https://picsum.photos/seed/rs-cat-frenos/640/640",
      href: "#productos",
    },
    {
      id: "accesorios",
      name: "Accesorios",
      imageSrc: "https://picsum.photos/seed/rs-cat-accesorios/640/640",
      href: "#productos",
    },
    {
      id: "mantenimiento",
      name: "Mantenimiento",
      imageSrc: "https://picsum.photos/seed/rs-cat-mantenimiento/640/640",
      href: "#productos",
    },
    {
      id: "electrico",
      name: "Eléctrico",
      imageSrc: "https://picsum.photos/seed/rs-cat-electrico/640/640",
      href: "#productos",
    },
  ],
  /** Colecciones destacadas — bloque editorial con 3 cards grandes */
  featuredCollections: [
    {
      id: "neumaticos",
      name: "Ruedas",
      description:
        "Ruedas neumáticas y giratorias de alta capacidad para uso industrial y todo terreno.",
      imageSrc:
        "https://static.wixstatic.com/media/5dd8a0_3b1611e26fd84e3d916286a373f76129~mv2.png",
      imageAlt:
        "Rueda neumática giratoria de alta capacidad con montura de acero, línea industrial",
      href: "#productos",
    },
    {
      id: "llantas",
      name: "Rodachines",
      description:
        "Carretillas industriales con chasis de acero reforzado, plataforma extensible y ruedas de alta resistencia.",
      imageSrc:
        "https://static.wixstatic.com/media/5dd8a0_e116003c96594f8e9abbd5a613cfa3ea~mv2.png",
      imageAlt:
        "Carretilla industrial roja con plataforma extensible y ruedas neumáticas de alta resistencia",
      href: "#productos",
    },
    {
      id: "accesorios",
      name: "Accesorios & repuestos",
      description:
        "Línea industrial, de uso interno y hospitalaria. Ruedas de goma de alta tracción con cubos azules y ergonomía superior.",
      imageSrc:
        "https://static.wixstatic.com/media/5dd8a0_22148fa1f24041839b1d8199ae973977~mv2.png",
      imageAlt:
        "Carretilla industrial azul con ruedas de goma de alta tracción y cubos azules",
      href: "#productos",
    },
  ],
  /** Testimonios de clientes */
  testimonials: {
    eyebrow: "Lo que dicen nuestros clientes",
    headline: "Clientes que vuelven por más.",
    items: [
      {
        id: "t1",
        quote:
          "Compré 4 neumáticos y el proceso fue impecable. La asesoría por WhatsApp me ayudó a elegir la medida exacta.",
        name: "Carlos R.",
        role: "Conductor particular",
      },
      {
        id: "t2",
        quote:
          "Atención rápida, precios justos y montaje profesional. Ya es mi tienda de confianza para la flota.",
        name: "María F.",
        role: "Administradora de flota",
      },
      {
        id: "t3",
        quote:
          "Recibí las llantas en menos de 48 h. La instalación en taller fue un detalle que no esperaba.",
        name: "Andrés P.",
        role: "Cliente corporativo",
      },
    ],
  },
  /** Copy del bloque de newsletter — interpretado Apple: sobrio y útil */
  newsletter: {
    eyebrow: "Comunidad",
    headline: "Mantente al día con Ruedas y Soluciones.",
    subline:
      "Consejos de mantenimiento, lanzamientos y promociones pensadas para conductores y flotas.",
    ctaLabel: "Suscribirme",
    placeholder: "tu@correo.com",
  },
  /** Footer multi-columna — referente a los bloques de links de macho.com.co */
  footer: {
    columns: [
      {
        title: "Tienda",
        links: [
          { label: "Neumáticos", href: "#productos" },
          { label: "Llantas", href: "#productos" },
          { label: "Accesorios", href: "#productos" },
          { label: "Promociones", href: "#productos" },
        ],
      },
      {
        title: "Atención",
        links: [
          { label: "Preguntas frecuentes", href: "#faq" },
          { label: "Garantía y devoluciones", href: "#garantia" },
          { label: "Términos de envío", href: "#envio" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "Sobre nosotros", href: "#nosotros" },
          { label: "Distribuidores", href: "#distribuidores" },
          { label: "Blog", href: "#blog" },
          { label: "Eventos", href: "#eventos" },
        ],
      },
    ],
    copyright: "© Ruedas y Soluciones. Todos los derechos reservados.",
    legalLinks: [
      { label: "Política de privacidad", href: "#privacidad" },
      { label: "Términos y condiciones", href: "#terminos" },
      { label: "Tratamiento de datos", href: "#datos" },
    ],
    socials: [
      { id: "instagram", label: "Instagram", href: "#instagram" },
      { id: "facebook", label: "Facebook", href: "#facebook" },
      { id: "tiktok", label: "TikTok", href: "#tiktok" },
    ],
  },
};
