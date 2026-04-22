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
      <ErrorBoundary fallback={<div class="p-6">Failed to load shop details</div>}>
        <Suspense fallback={<div class="p-6">Loading shop details...</div>}>
          <Show when={shop()}>
            {(shopData) => (
              <>
                <ShopDetailHeader shop={shopData()} />
                <ShopTabNav tabs={tabs} shopId={params.shop_id || ""} />
                <div class="p-6 max-w-[1400px] mx-auto">
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
