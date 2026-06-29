import { createAsync, type RouteDefinition } from "@solidjs/router";
import {
  createDeferred,
  createEffect,
  createMemo,
  createSignal,
  Show,
  Suspense,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Meta, Title } from "@solidjs/meta";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { Pagination } from "~/components/ui/Pagination";
import { InventoryIcon } from "~/components/icons";
import {
  getAdminProducts,
  type AdminProductSummary,
} from "~/lib/api/endpoints/products";
import type { PaginatedResult } from "~/lib/api/types";
import type { ProductStatus } from "~/lib/api/endpoints/products";
import { ProductsTable } from "./components/ProductsTable";

export const route: RouteDefinition = {
  preload: () => getAdminProducts({ limit: 10 }),
};

const PRODUCT_STATUSES: ProductStatus[] = ["ACTIVE", "DRAFT", "ARCHIVED"];

export default function ProductsPage() {
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);
  const [filters, setFilters] = createStore({
    search: "",
    status: undefined as ProductStatus | undefined,
  });

  const debouncedSearch = createDeferred(() => filters.search, { timeoutMs: 300 });

  const productsData = createAsync(() =>
    getAdminProducts({
      page: page(),
      limit: limit(),
      search: debouncedSearch() || undefined,
      status: filters.status,
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
    filters.status;
    if (page() !== 1) setPage(1);
  });

  const displayProducts = createMemo(() => stableProducts()?.data ?? []);

  return (
    <PageShell>
      <Title>Products | ByteForge Admin</Title>
      <Meta name="description" content="Moderate marketplace products across all shops." />

      <PageHeader
        title="Products"
        description="Search and archive products that violate marketplace policies."
        icon={InventoryIcon}
      />

      <div class="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <input
          type="text"
          placeholder="Search product name or slug..."
          class="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-green-500"
          value={filters.search}
          onInput={(event) => setFilters("search", event.currentTarget.value)}
        />
        <select
          class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          value={filters.status ?? ""}
          onChange={(event) =>
            setFilters(
              "status",
              (event.currentTarget.value || undefined) as ProductStatus | undefined,
            )
          }
        >
          <option value="">All statuses</option>
          {PRODUCT_STATUSES.map((status) => (
            <option value={status}>{status}</option>
          ))}
        </select>
      </div>

      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="products list" />
        )}
      >
        <Show
          when={stableProducts()}
          fallback={<div class="h-96 animate-pulse rounded-2xl bg-slate-50" />}
        >
          <ProductsTable products={displayProducts()} />
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
    </PageShell>
  );
}
