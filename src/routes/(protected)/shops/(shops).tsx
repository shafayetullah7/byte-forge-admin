import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { createMemo, Suspense, createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { Pagination } from "~/components/ui/Pagination";
import { ShopsHeader, ShopsToolbar, ShopsTable } from "./components";
import { StatsPanel } from "./StatsPanel";
import { getShops, type Shop, type ShopStatus } from "~/lib/api/endpoints/shops";

interface FilterState {
  search: string;
  status: ShopStatus | undefined;
}

// Preload for initial page load (works for both SSR and CSR navigation)
export const route: RouteDefinition = {
  preload: () => getShops(),
};

export default function ShopsPageIndex() {
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);

  // Raw async signal — may be undefined while fetching
  const shopsData = createAsync(() => getShops({ page: page(), limit: limit() }));

  // FIX 1: Stable signal that keeps the last resolved value (stale-while-revalidate)
  const [stableShops, setStableShops] = createSignal<
    { data: Shop[]; meta: any } | undefined
  >(undefined);

  createEffect(() => {
    const d = shopsData();
    if (d !== undefined) setStableShops(d);
  });

  const [filters, setFilters] = createStore<FilterState>({
    search: "",
    status: undefined,
  });

  // Use stableShops instead of shopsData to prevent suspension during pagination
  const filteredShops = createMemo(() => {
    const data = stableShops();
    if (!data) return [];

    const search = filters.search.toLowerCase().trim();
    const status = filters.status;

    if (!search && !status) return data.data || [];

    return (data.data || []).filter((shop: Shop) => {
      const matchesSearch =
        !search ||
        shop.nameEn?.toLowerCase().includes(search) ||
        shop.slug.toLowerCase().includes(search) ||
        shop.city?.toLowerCase().includes(search) ||
        shop.division?.toLowerCase().includes(search);
      const matchesStatus = !status || shop.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      {/* Header */}
      <ShopsHeader />

      {/* FIX 2: StatsPanel is now an isolated component with its own reactive owner */}
      <div class="mb-8">
        <SafeErrorBoundary
          fallback={(err, reset) => (
            <InlineErrorFallback error={err} reset={reset} label="shop statistics" />
          )}
        >
          <Suspense fallback={<div class="h-24 bg-slate-50 rounded-2xl animate-pulse" />}>
            <StatsPanel />
          </Suspense>
        </SafeErrorBoundary>
      </div>

      {/* Toolbar */}
      <ShopsToolbar
        search={filters.search}
        onSearchChange={(value) => setFilters("search", value)}
        status={filters.status}
        onStatusChange={(value) => setFilters("status", value)}
      />

      {/* Shop List */}
      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="shop list" />
        )}
      >
        <Suspense fallback={<div class="h-96 bg-slate-50 rounded-2xl animate-pulse" />}>
          <ShopsTable shops={filteredShops()} />
        </Suspense>
      </SafeErrorBoundary>

      {/* Pagination - use stableShops for stable meta */}
      {stableShops()?.meta && (
        <Pagination
          meta={stableShops()!.meta}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            if (page() !== 1) {
              setPage(1);
            }
          }}
          showLimitSelector={true}
        />
      )}
    </div>
  );
}
