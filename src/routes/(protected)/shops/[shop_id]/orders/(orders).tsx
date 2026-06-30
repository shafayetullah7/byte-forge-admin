import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { createEffect, createMemo, createSignal, Show, Suspense } from "solid-js";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { Pagination } from "~/components/ui/Pagination";
import {
  getAdminOrderStats,
  getAdminOrders,
  type AdminOrderSummary,
  type PaginatedResult,
} from "~/lib/api/endpoints/orders";
import { OrdersTable } from "~/routes/(protected)/orders/components/OrdersTable";

export const route: RouteDefinition = {
  preload: ({ params }) => getAdminOrders({ shopId: params.shop_id!, limit: 10 }),
};

export default function ShopOrdersRoute() {
  const params = useParams();
  const shopId = () => params.shop_id!;

  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);

  const ordersData = createAsync(() =>
    getAdminOrders({
      shopId: shopId(),
      page: page(),
      limit: limit(),
    }),
  );

  const statsData = createAsync(() => getAdminOrderStats({ shopId: shopId() }));

  const [stableOrders, setStableOrders] = createSignal<
    PaginatedResult<AdminOrderSummary> | undefined
  >(undefined);

  createEffect(() => {
    const data = ordersData();
    if (data !== undefined) {
      setStableOrders(data);
    }
  });

  const displayOrders = createMemo(() => stableOrders()?.data ?? []);
  const stats = () => statsData();

  return (
    <div class="space-y-6">
      <Show when={stats()}>
        {(s) => (
          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-2xl font-bold text-slate-900">{s().total}</p>
              <p class="text-xs text-slate-500 mt-1">Total Orders</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-2xl font-bold text-emerald-600">{s().delivered}</p>
              <p class="text-xs text-slate-500 mt-1">Delivered / Completed</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-2xl font-bold text-amber-600">{s().processing}</p>
              <p class="text-xs text-slate-500 mt-1">In Progress</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-2xl font-bold text-red-600">{s().cancelled}</p>
              <p class="text-xs text-slate-500 mt-1">Cancelled</p>
            </div>
          </div>
        )}
      </Show>

      <SafeErrorBoundary
        fallback={(error, reset) => (
          <InlineErrorFallback error={error} reset={reset} label="shop orders" />
        )}
      >
        <Suspense fallback={<div class="text-sm text-slate-500">Loading orders...</div>}>
          <OrdersTable orders={displayOrders()} showShop={false} />
        </Suspense>
      </SafeErrorBoundary>

      <Show when={stableOrders()?.meta}>
        {(m) => (
          <Pagination
            meta={m()}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              if (page() !== 1) setPage(1);
            }}
            showLimitSelector
          />
        )}
      </Show>
    </div>
  );
}
