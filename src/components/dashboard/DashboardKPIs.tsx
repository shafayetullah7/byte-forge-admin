import { createAsync } from "@solidjs/router";
import { Suspense, Show } from "solid-js";
import { StorefrontIcon, VerifiedUserIcon, ShoppingCartIcon } from "~/components/icons";
import { getShopStats } from "~/lib/api/endpoints/shops";
import { getAdminOrderStats } from "~/lib/api/endpoints/orders";

export function DashboardKPIs() {
  const shopStats = createAsync(() => getShopStats());
  const orderStats = createAsync(() => getAdminOrderStats());

  return (
    <Suspense fallback={<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div class="h-[130px] animate-pulse rounded-xl bg-slate-100" />
      <div class="h-[130px] animate-pulse rounded-xl bg-slate-100" />
      <div class="h-[130px] animate-pulse rounded-xl bg-slate-100" />
    </div>}>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="flex h-[130px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between">
            <span class="text-sm font-medium text-slate-500">Active shops</span>
            <div class="rounded-lg bg-slate-50 p-2 text-indigo-600">
              <StorefrontIcon class="h-5 w-5" />
            </div>
          </div>
          <Show when={shopStats()} fallback={<span class="text-2xl font-extrabold text-slate-300">—</span>}>
            {(stats) => (
              <span class="text-2xl font-extrabold text-slate-900">{stats().activeShops}</span>
            )}
          </Show>
        </div>

        <div class="flex h-[130px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between">
            <span class="text-sm font-medium text-slate-500">Pending verifications</span>
            <div class="rounded-lg bg-slate-50 p-2 text-amber-600">
              <VerifiedUserIcon class="h-5 w-5" />
            </div>
          </div>
          <Show when={shopStats()} fallback={<span class="text-2xl font-extrabold text-slate-300">—</span>}>
            {(stats) => (
              <span class="text-2xl font-extrabold text-slate-900">{stats().pendingVerifications}</span>
            )}
          </Show>
        </div>

        <div class="flex h-[130px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between">
            <span class="text-sm font-medium text-slate-500">Total orders</span>
            <div class="rounded-lg bg-slate-50 p-2 text-primary-green">
              <ShoppingCartIcon class="h-5 w-5" />
            </div>
          </div>
          <Show when={orderStats()} fallback={<span class="text-2xl font-extrabold text-slate-300">—</span>}>
            {(stats) => (
              <span class="text-2xl font-extrabold text-slate-900">{stats().total}</span>
            )}
          </Show>
        </div>
      </div>
    </Suspense>
  );
}
