import { ErrorBoundary, Suspense, Show } from "solid-js";
import { createAsync, useParams, type RouteDefinition, type RouteSectionProps } from "@solidjs/router";
import { ShopDetailHeader, ShopTabNav, TabId } from "./[shop_id]/components";
import { getShopDetail } from "~/lib/api/endpoints/shops";

const tabs: { id: TabId; label: string; icon: string; path: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", path: "" },
  { id: "verification", label: "Verification", icon: "verified_user", path: "verification" },
  { id: "profile", label: "Profile", icon: "storefront", path: "profile" },
  { id: "contact", label: "Contact", icon: "contact_phone", path: "contact" },
  { id: "address", label: "Address", icon: "location_on", path: "address" },
  { id: "products", label: "Products", icon: "inventory_2", path: "products" },
  { id: "orders", label: "Orders", icon: "shopping_cart", path: "orders" },
  { id: "delivery", label: "Delivery", icon: "local_shipping", path: "delivery" },
  { id: "owner", label: "Owner", icon: "person", path: "owner" },
  { id: "financials", label: "Financials", icon: "payments", path: "financials" },
  { id: "history", label: "History", icon: "history", path: "history" },
  { id: "actions", label: "Actions", icon: "settings", path: "actions" },
];

export const route: RouteDefinition = {
  preload: ({ params }) => {
    return getShopDetail(params.shop_id!);
  },
};

export default function ShopDetailLayout(props: RouteSectionProps) {
  const params = useParams();

  const shop = createAsync(() => getShopDetail(params.shop_id!));

  return (
    <div class="min-h-screen bg-slate-50">
      {/* Critical error boundary - shop data is required for entire page */}
      <ErrorBoundary
        fallback={(error) => (
          <div class="min-h-screen flex items-center justify-center p-6">
            <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full">
              <div class="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h2 class="text-lg font-semibold text-red-900">Failed to Load Shop</h2>
              </div>
              <p class="text-sm text-red-700 mb-4">
                Unable to load shop details. This may be due to a network error or the shop doesn't exist.
              </p>
              <div class="flex gap-2">
                <button 
                  onClick={() => window.location.reload()}
                  class="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
                <a 
                  href="/shops"
                  class="flex-1 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors text-center"
                >
                  Back to Shops
                </a>
              </div>
            </div>
          </div>
        )}
      >
        <Suspense fallback={<div class="p-6">Loading shop details...</div>}>
          <Show when={shop()}>
            {(shopData) => (
              <>
                <ShopDetailHeader shop={shopData()} />
                <ShopTabNav tabs={tabs} shopId={params.shop_id || ""} />
                <div class="p-6 max-w-[1400px] mx-auto">
                  {/* Each child route has its own ErrorBoundary for route-specific errors */}
                  {props.children}
                </div>
              </>
            )}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
