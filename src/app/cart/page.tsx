import { CartPageView } from "@/components/store/cart-page-view";
import { StoreNavbar } from "@/components/store/navbar";
import { defaultStoreConfig } from "@/config/store-defaults";
import { themeToStyle } from "@/lib/store-types";

export const metadata = {
  title: "Carrito",
};

export default function CartPage() {
  const store = defaultStoreConfig;

  return (
    <div
      className="store-page-shell flex min-h-[100dvh] w-full flex-col text-[var(--store-text)]"
      style={store.theme ? themeToStyle(store.theme) : undefined}
    >
      <StoreNavbar brand={store.brand} links={store.navLinks} sticky />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <CartPageView />
      </main>
    </div>
  );
}
