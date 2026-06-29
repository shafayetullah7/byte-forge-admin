import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import {
  createDeferred,
  createEffect,
  createMemo,
  createSignal,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { Pagination } from "~/components/ui/Pagination";
import {
  getAdminProducts,
  type AdminProductSummary,
} from "~/lib/api/endpoints/products";
import type { PaginatedResult } from "~/lib/api/types";
import { ProductsTable } from "~/routes/(protected)/products/components/ProductsTable";

export default function ShopProductsRoute() {
  const params = useParams();
  const shopId = () => params.shop_id;

  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);
  const [filters, setFilters] = createStore({ search: "" });
  const debouncedSearch = createDeferred(() => filters.search, { timeoutMs: 300 });

  const productsData = createAsync(() =>
    getAdminProducts({
      shopId: shopId(),
      page: page(),
      limit: limit(),
      search: debouncedSearch() || undefined,
    }),
  );

  const [stableProducts, setStableProducts] = createSignal<
    PaginatedResult<AdminProductSummary> | undefined
  >(undefined);

  createEffect(() => {
    const data = productsData();
    if (data !== undefined) {
      setStableProducts(data);
    }
  });

  createEffect(() => {
    debouncedSearch();
    if (page() !== 1) setPage(1);
  });

  const displayProducts = createMemo(() => stableProducts()?.data ?? []);

  return (
    <div class="space-y-6">
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <input
          type="text"
          placeholder="Search products in this shop..."
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-green-500 md:max-w-md"
          value={filters.search}
          onInput={(event) => setFilters("search", event.currentTarget.value)}
        />
      </div>

      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="shop products" />
        )}
      >
        <Show
          when={stableProducts()}
          fallback={<div class="h-64 animate-pulse rounded-2xl bg-slate-50" />}
        >
          <ProductsTable products={displayProducts()} showShop={false} />
        </Show>
      </SafeErrorBoundary>

      <Show when={stableProducts()?.meta}>
        {(meta) => (
          <Pagination
            meta={meta()}
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
