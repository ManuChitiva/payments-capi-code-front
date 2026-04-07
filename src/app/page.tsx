import { CatalogSection } from "@/components/store/catalog-section";
import { StoreNavbar } from "@/components/store/navbar";
import { StoreSidebar } from "@/components/store/store-sidebar";
import { defaultStoreConfig } from "@/config/store-defaults";
import { themeToStyle } from "@/lib/store-types";

export default function Home() {
  const store = defaultStoreConfig;

  return (
    <div
      className="store-page-shell flex min-h-[100dvh] w-full flex-col text-[var(--store-text)]"
      style={store.theme ? themeToStyle(store.theme) : undefined}
    >
      <StoreNavbar brand={store.brand} links={store.navLinks} sticky />
      <main
        id="productos"
        className="w-full min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10 2xl:px-14"
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:gap-12">
          <aside className="order-2 mt-12 space-y-5 lg:order-1 lg:mt-0 lg:sticky lg:top-[5.25rem] lg:self-start">
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
    </div>
  );
}
