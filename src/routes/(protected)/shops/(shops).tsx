import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createMemo, Suspense, createSignal, createEffect, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { Pagination } from "~/components/ui/Pagination";
import { ShopsHeader, ShopsToolbar, ShopsTable } from "./components";
import { StatsPanel } from "./StatsPanel";
import { getShops, type Shop, type ShopStatus, type ShopVerificationStatus, type PaginatedResult } from "~/lib/api/endpoints/shops";

interface FilterState {
  search: string;
  status: ShopStatus | undefined;
  verificationStatus: ShopVerificationStatus | undefined;
}

export const route: RouteDefinition = {
  preload: () => getShops(),
};

export default function ShopsPageIndex() {
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);
  
  const [filters, setFilters] = createStore<FilterState>({
    search: "",
    status: undefined,
    verificationStatus: undefined,
  });

  // Debounced search to avoid excessive API calls
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  
  createEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(timer);
  });

  // Server-side filtering - pass filters to backend
  const shopsData = createAsync(() => getShops({ 
    page: page(), 
    limit: limit(),
    ...(debouncedSearch() && { search: debouncedSearch() }),
    ...(filters.status && { status: filters.status }),
    ...(filters.verificationStatus && { verificationStatus: filters.verificationStatus }),
  }));

  // Stable signal keeps last resolved value (prevents blinking during refetch)
  const [stableShops, setStableShops] = createSignal<PaginatedResult<Shop> | undefined>(undefined);
  const [isRefetching, setIsRefetching] = createSignal(false);

  createEffect(() => {
    const d = shopsData();
    if (d !== undefined) {
      setStableShops(d);
      setIsRefetching(false);
    } else if (stableShops() !== undefined) {
      // shopsData is undefined but we have stable data → refetching
      setIsRefetching(true);
    }
  });

  // Reset page when filters change (backend will return different results)
  createEffect(() => {
    debouncedSearch();
    filters.status;
    filters.verificationStatus;
    if (page() !== 1) setPage(1);
  });

  // Display data - uses stable data during refetch
  const displayShops = createMemo(() => stableShops()?.data || []);

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
        verificationStatus={filters.verificationStatus}
        onVerificationStatusChange={(value) => setFilters("verificationStatus", value)}
      />

      {/* Shop List - with loading overlay during refetch */}
      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="shop list" />
        )}
      >
        <Show
          when={stableShops()}
          fallback={<div class="h-96 bg-slate-50 rounded-2xl animate-pulse" />}
        >
          <div class="relative">
            <ShopsTable shops={displayShops()} />
            <Show when={isRefetching()}>
              <div class="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <div class="flex items-center gap-2 text-slate-600">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span class="text-sm font-medium">Updating...</span>
                </div>
              </div>
            </Show>
          </div>
        </Show>
      </SafeErrorBoundary>

      {/* Pagination - use stableShops for stable meta */}
      {stableShops()?.meta && (
        <Pagination
          meta={stableShops()!.meta}
          onPageChange={(newPage) => setPage(newPage)}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            if (page() !== 1) setPage(1);
          }}
          showLimitSelector={true}
        />
      )}
    </div>
  );
}
