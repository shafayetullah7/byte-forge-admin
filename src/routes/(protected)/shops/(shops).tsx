import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { createMemo, Suspense, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { Pagination } from "~/components/ui/Pagination";
import { ShopsHeader, ShopsToolbar, ShopsTable } from "./components";
import { getShops, getShopStats, type Shop, type ShopStats, type ShopStatus } from "~/lib/api/endpoints/shops";

interface FilterState {
  search: string;
  status: ShopStatus | undefined;
}

// Preload for initial page load (works for both SSR and CSR navigation)
export const route: RouteDefinition = {
  preload: () => getShops(),
};

export default function ShopsPageIndex() {
  // Pagination state
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);
  
  // Both queries use createAsync - SolidStart router caches by query key
  const shopsData = createAsync(() => getShops({
    page: page(),
    limit: limit(),
  }));
  const statsData = createAsync(() => getShopStats());
  
  // Store for filters
  const [filters, setFilters] = createStore<FilterState>({
    search: "",
    status: undefined,
  });

  // Filter logic
  const filteredShops = createMemo(() => {
    const data = shopsData();
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

  // Metrics - memoized to prevent unnecessary recalculations
  const metrics = createMemo(() => {
    const data = statsData();
    if (!data) return [];

    return [
      { label: "Total Shops", value: data.totalShops.toString(), subValue: "Registered sellers" },
      { label: "Approved", value: data.activeShops.toString(), subValue: "Active shops" },
      { label: "Pending Approval", value: data.pendingShops.toString(), subValue: "Awaiting review" },
      { label: "Suspended", value: data.suspendedShops.toString(), subValue: "Policy violations" },
    ];
  });

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      {/* Header */}
      <ShopsHeader />

      {/* Stats */}
      <div class="mb-8">
        <SafeErrorBoundary
          fallback={(err, reset) => (
            <InlineErrorFallback error={err} reset={reset} label="shop statistics" />
          )}
        >
          <TagMetricsPanel metrics={metrics()} />
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

      {/* Pagination */}
      {shopsData()?.meta && (
        <Pagination
          meta={shopsData()!.meta}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
