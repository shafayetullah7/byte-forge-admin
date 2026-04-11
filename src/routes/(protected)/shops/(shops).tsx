import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Suspense, createSignal, createMemo } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { getShops, type Shop } from "~/lib/api/endpoints/shops";
import { ShopList } from "~/components/shops/ShopList";

export const route: RouteDefinition = {
  preload: () => getShops(),
};

export default function ShopsPageIndex() {
  const shopsData = createAsync(() => getShops());
  const [searchTerm, setSearchTerm] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<string | undefined>(undefined);

  const filteredShops = createMemo(() => {
    const data = shopsData();
    if (!data?.data) return { data: [], pagination: data?.pagination };

    const search = searchTerm().toLowerCase().trim();
    const status = statusFilter();

    if (!search && !status) return data;

    const filtered = data.data.filter((shop: Shop) => {
      const matchesSearch =
        !search ||
        shop.nameEn.toLowerCase().includes(search) ||
        shop.slug.toLowerCase().includes(search) ||
        shop.city.toLowerCase().includes(search) ||
        shop.division.toLowerCase().includes(search);
      const matchesStatus = !status || shop.status === status;
      return matchesSearch && matchesStatus;
    });

    return { ...data, data: filtered };
  });

  const metrics = () => {
    const data = shopsData()?.data;
    if (!data) return [];

    const total = data.length;
    const approved = data.filter((s: Shop) => s.status === "APPROVED").length;
    const pending = data.filter((s: Shop) => s.status === "PENDING_VERIFICATION").length;
    const suspended = data.filter((s: Shop) => s.status === "SUSPENDED").length;

    return [
      { label: "Total Shops", value: total.toString(), subValue: "Registered sellers" },
      { label: "Approved", value: approved.toString(), subValue: "Active shops" },
      { label: "Pending Approval", value: pending.toString(), subValue: "Awaiting review" },
      { label: "Suspended", value: suspended.toString(), subValue: "Policy violations" },
    ];
  };

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      {/* Page Header */}
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Shop Management</h1>
          <p class="text-sm text-slate-500 mt-1">
            Review and approve seller shops, manage shop status, and monitor compliance.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div class="mb-8">
        <SafeErrorBoundary
          fallback={(err, reset) => (
            <InlineErrorFallback error={err} reset={reset} label="shop metrics" />
          )}
        >
          <Suspense fallback={<div class="h-32 bg-slate-50 rounded-2xl animate-pulse" />}>
            <TagMetricsPanel metrics={metrics()} />
          </Suspense>
        </SafeErrorBoundary>
      </div>

      {/* Toolbar */}
      <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="relative w-full sm:max-w-[400px]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <Input
            label="Search"
            placeholder="Search shops by name, location..."
            class="pl-10 w-full"
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <select
            class="h-11 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 w-full sm:w-auto"
            value={statusFilter() || ""}
            onChange={(e) => setStatusFilter(e.currentTarget.value || undefined)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING_VERIFICATION">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Shop List */}
      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="shop list" />
        )}
      >
        <Suspense fallback={<div class="h-96 bg-slate-50 rounded-2xl animate-pulse" />}>
          <ShopList
            shops={filteredShops()?.data || []}
            pagination={filteredShops()?.pagination}
          />
        </Suspense>
      </SafeErrorBoundary>
    </div>
  );
}
