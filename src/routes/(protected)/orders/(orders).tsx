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
import { ShoppingCartIcon } from "~/components/icons";
import {
  getAdminOrderStats,
  getAdminOrders,
  type AdminOrderSummary,
  type OrderStatus,
  type PaginatedResult,
} from "~/lib/api/endpoints/orders";
import { OrdersTable } from "./components/OrdersTable";

export const route: RouteDefinition = {
  preload: () => getAdminOrders({ limit: 10 }),
};

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
];

export default function OrdersPage() {
  const [page, setPage] = createSignal(1);
  const [limit, setLimit] = createSignal(10);
  const [filters, setFilters] = createStore({
    search: "",
    status: undefined as OrderStatus | undefined,
  });

  const debouncedSearch = createDeferred(() => filters.search, { timeoutMs: 300 });

  const ordersData = createAsync(() =>
    getAdminOrders({
      page: page(),
      limit: limit(),
      search: debouncedSearch() || undefined,
      status: filters.status,
    }),
  );

  const statsData = createAsync(() => getAdminOrderStats());

  const [stableOrders, setStableOrders] = createSignal<
    PaginatedResult<AdminOrderSummary> | undefined
  >(undefined);

  createEffect(() => {
    const data = ordersData();
    if (data !== undefined) {
      setStableOrders(data);
    }
  });

  createEffect(() => {
    debouncedSearch();
    filters.status;
    if (page() !== 1) setPage(1);
  });

  const displayOrders = createMemo(() => stableOrders()?.data ?? []);
  const stats = () => statsData();

  return (
    <PageShell>
      <Title>Orders | ByteForge Admin</Title>
      <Meta name="description" content="Search and review marketplace orders." />

      <PageHeader
        title="Orders"
        description="Find orders across all shops for support and operations."
        icon={ShoppingCartIcon}
      />

      <Suspense fallback={<div class="mb-6 h-24 animate-pulse rounded-2xl bg-slate-50" />}>
        <Show when={stats()}>
          {(data) => (
            <div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase text-slate-500">Total</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">{data().total}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase text-slate-500">Processing</p>
                <p class="mt-1 text-2xl font-bold text-amber-600">
                  {data().processing + data().pending}
                </p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase text-slate-500">Delivered</p>
                <p class="mt-1 text-2xl font-bold text-emerald-600">{data().delivered}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase text-slate-500">Revenue</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">
                  ৳ {Number(data().revenue).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </Show>
      </Suspense>

      <div class="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <input
          type="text"
          placeholder="Search order number, customer, phone..."
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
              (event.currentTarget.value || undefined) as OrderStatus | undefined,
            )
          }
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option value={status}>{status.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="orders list" />
        )}
      >
        <Show
          when={stableOrders()}
          fallback={<div class="h-96 animate-pulse rounded-2xl bg-slate-50" />}
        >
          <OrdersTable orders={displayOrders()} />
        </Show>
      </SafeErrorBoundary>

      <Show when={stableOrders()?.meta}>
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
