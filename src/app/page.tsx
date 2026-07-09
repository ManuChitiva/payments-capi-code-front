import { AdvisorsModalProvider } from "@/components/store/advisors-launcher";
import { CatalogSection } from "@/components/store/catalog-section";
import { FeaturedCollections } from "@/components/store/featured-collections";
import { FooterStorefront } from "@/components/store/footer-storefront";
import { HeroCarousel } from "@/components/store/hero-carousel";
import { HeroSection } from "@/components/store/hero-section";
import { NewsletterBand } from "@/components/store/newsletter-band";
import { ProfileBand } from "@/components/store/profile-band";
import { StoreNavbar } from "@/components/store/navbar";
import { StoreSidebar } from "@/components/store/store-sidebar";
import { TestimonialsBand } from "@/components/store/testimonials-band";
import { getStoreConfigFromApi } from "@/lib/store-api";
import { themeToStyle } from "@/lib/store-types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const store = await getStoreConfigFromApi();

  // Imagen de fondo del hero / carrusel: preferir la portada del API;
  // caer al placeholder del config si el backend no la envía.
  const heroImage =
    store.profile?.coverImageUrl?.trim()
      ? { src: store.profile.coverImageUrl, alt: store.brand.name }
      : store.heroImage;

  const hasSlides =
    Array.isArray(store.heroSlides) && store.heroSlides.length > 0;

  return (
    <AdvisorsModalProvider advisors={store.advisors ?? []}>
      <div
        className="flex min-h-[100dvh] w-full flex-col text-[var(--store-text)]"
        style={store.theme ? themeToStyle(store.theme) : undefined}
      >
        <StoreNavbar brand={store.brand} links={store.navLinks} sticky />

        {hasSlides ? (
          <HeroCarousel
            slides={store.heroSlides ?? []}
            fallbackImage={heroImage}
          />
        ) : (
          <HeroSection
            brand={store.brand}
            hero={{
              eyebrow: store.brand.name,
              headline: "Tu próxima *rodada* empieza aquí.",
              subline:
                store.profile?.description?.trim() ??
                "Neumáticos, llantas y accesorios originales con asesoría experta, instalación incluida y envío a todo el país.",
              primaryCta: { label: "Ver catálogo", anchor: "#productos" },
              secondaryCta: {
                label: "Hablar con un experto",
                anchor: "#contacto",
              },
            }}
            image={heroImage}
            stats={store.heroStats}
          />
        )}

        {store.featuredCollections && store.featuredCollections.length > 0 ? (
          <FeaturedCollections
            eyebrow="Colecciones principales"
            headline="Tres líneas que cubren todo lo que tu vehículo necesita."
            subline="Cada colección reúne productos originales, marcas reconocidas y el respaldo de nuestro equipo técnico."
            collections={store.featuredCollections}
          />
        ) : null}

        {store.profile &&
        (store.profile.description ||
          store.profile.email ||
          store.profile.website ||
          store.profile.schedule ||
          store.profile.paymentMethods) ? (
          <ProfileBand profile={store.profile} />
        ) : null}

        <main
          id="productos"
          className="w-full min-w-0 flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 xl:px-10 2xl:px-14"
        >
          <div className="lg:grid lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:gap-12">
            <aside
              id="contacto"
              className="order-2 mt-12 mb-10 space-y-5 lg:order-1 lg:mt-0 lg:mb-0 lg:sticky lg:top-[5.25rem] lg:self-start"
            >
              <StoreSidebar contact={store.contact} pickup={store.pickup} />
            </aside>
            <div className="order-1 min-w-0">
              <CatalogSection
                eyebrow={store.catalog.eyebrow}
                headline={store.catalog.headline}
                subline={store.catalog.subline}
                sortLabel={store.catalog.sortLabel}
                sortOptions={store.catalog.sortOptions}
                products={store.catalog.products}
              />
            </div>
          </div>
        </main>

        {store.testimonials && store.testimonials.items.length > 0 ? (
          <TestimonialsBand
            eyebrow={store.testimonials.eyebrow}
            headline={store.testimonials.headline}
            items={store.testimonials.items}
          />
        ) : null}

        {store.newsletter ? (
          <NewsletterBand
            eyebrow={store.newsletter.eyebrow}
            headline={store.newsletter.headline}
            subline={store.newsletter.subline}
            ctaLabel={store.newsletter.ctaLabel}
            placeholder={store.newsletter.placeholder}
          />
        ) : null}

        {store.footer ? (
          <FooterStorefront
            brand={store.brand}
            footer={store.footer}
            socials={store.socials ?? null}
          />
        ) : null}
      </div>
    </AdvisorsModalProvider>
  );
}