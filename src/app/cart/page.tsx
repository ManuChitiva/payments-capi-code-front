import { CartPageView } from "@/components/store/cart-page-view";
import { StoreNavbar } from "@/components/store/navbar";
import { getStoreConfigFromApi } from "@/lib/store-api";
import { fetchPayuStatus } from "@/lib/store-checkout";
import { themeToStyle } from "@/lib/store-types";
import { resolveWhatsAppBaseHref } from "@/lib/whatsapp-order-fallback";

export const metadata = {
  title: "Carrito",
};

export default async function CartPage() {
  const store = await getStoreConfigFromApi();

  const payuStatusFetchAttempted = Boolean(
    store.slug && process.env.STORE_API_BASE_URL,
  );
  const payuStatus = payuStatusFetchAttempted
    ? await fetchPayuStatus(store.slug!)
    : null;

  const whatsappBaseHref = resolveWhatsAppBaseHref(store.contact.lines);

  return (
    <div
      className="store-page-shell flex min-h-[100dvh] w-full flex-col text-[var(--store-text)]"
      style={store.theme ? themeToStyle(store.theme) : undefined}
    >
      <StoreNavbar brand={store.brand} links={store.navLinks} sticky />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <CartPageView
          storeId={store.storeId}
          storeName={store.brand.name}
          payuStatus={payuStatus}
          payuStatusFetchAttempted={payuStatusFetchAttempted}
          whatsappBaseHref={whatsappBaseHref}
        />
      </main>
    </div>
  );
}
