import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { PaymentsIcon } from "~/components/icons";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { getPaymentMethods } from "~/lib/api/endpoints/payment-methods";
import type { PaymentMethodStatus } from "~/lib/api/endpoints/payment-methods";
import { PaymentMethodLogo } from "./components/PaymentMethodLogo";
import { formatDate } from "./components/format-date";

export const route: RouteDefinition = {
  preload: () => getPaymentMethods(),
};

export default function PaymentMethodsPage() {
  const methodsData = createAsync(() => getPaymentMethods());
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<"" | PaymentMethodStatus>("");

  const methods = () => methodsData() ?? [];

  const filteredMethods = createMemo(() => {
    const q = searchQuery().toLowerCase().trim();
    const status = statusFilter();
    return methods().filter((m) => {
      const matchesSearch =
        !q ||
        m.key.toLowerCase().includes(q) ||
        m.displayName.toLowerCase().includes(q);
      const matchesStatus = !status || m.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  const metrics = createMemo(() => {
    const all = methods();
    const active = all.filter((m) => m.status === "ACTIVE").length;
    const inactive = all.filter((m) => m.status === "INACTIVE").length;
    return [
      { label: "Total Methods", value: String(all.length), subValue: "Catalog entries" },
      { label: "Active", value: String(active), subValue: "Available at checkout" },
      { label: "Inactive", value: String(inactive), subValue: "Hidden from buyers" },
      {
        label: "Checkout Ready",
        value: active > 0 ? "Yes" : "No",
        subValue: active === 1 ? "1 method" : `${active} methods`,
      },
    ];
  });

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Payment Methods | ByteForge Admin</Title>
        <Meta name="description" content="Manage platform payment methods" />

        <PageHeader
          title="Payment Methods"
          description="Manage checkout payment options. Only active methods appear to buyers."
          icon={PaymentsIcon}
        >
          <A href="/payment-methods/create">
            <Button variant="primary" size="md">
              Add Payment Method
            </Button>
          </A>
        </PageHeader>

        <Suspense fallback={<div class="h-24 bg-slate-50 rounded-2xl animate-pulse mb-8" />}>
          <TagMetricsPanel metrics={metrics()} />
        </Suspense>

        <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="relative w-full sm:max-w-[400px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <Input
              label="Search"
              placeholder="Search by key or display name..."
              class="pl-10 w-full"
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button
              type="button"
              class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${statusFilter() === "" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              onClick={() => setStatusFilter("")}
            >
              All
            </button>
            <button
              type="button"
              class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${statusFilter() === "ACTIVE" ? "bg-primary-green-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-primary-green-50"}`}
              onClick={() => setStatusFilter("ACTIVE")}
            >
              Active
            </button>
            <button
              type="button"
              class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${statusFilter() === "INACTIVE" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              onClick={() => setStatusFilter("INACTIVE")}
            >
              Inactive
            </button>
          </div>
        </div>

        <Suspense
          fallback={
            <Card class="overflow-hidden border-slate-200 shadow-sm h-96 animate-pulse bg-slate-50" />
          }
        >
          <Card class="overflow-hidden border-slate-200 shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200">
                    <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Method</th>
                    <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key</th>
                    <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Updated</th>
                    <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <For
                    each={filteredMethods()}
                    fallback={
                      <tr>
                        <td colspan="5" class="px-6 py-16 text-center">
                          <div class="flex flex-col items-center">
                            <PaymentsIcon class="w-10 h-10 text-slate-300 mb-3" />
                            <p class="text-sm font-semibold text-slate-500">No payment methods found</p>
                            <p class="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
                          </div>
                        </td>
                      </tr>
                    }
                  >
                    {(method) => (
                      <tr class="group hover:bg-slate-50/50 transition-colors">
                        <td class="px-6 py-4">
                          <A
                            href={`/payment-methods/${method.id}`}
                            class="flex items-center gap-3 text-slate-900 hover:text-primary-green-700 transition-colors"
                          >
                            <PaymentMethodLogo method={method} />
                            <span class="font-semibold">{method.displayName}</span>
                          </A>
                        </td>
                        <td class="px-6 py-4">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                            {method.key}
                          </span>
                        </td>
                        <td class="px-6 py-4 max-w-xs">
                          <p class="text-sm text-slate-500 truncate">{method.description ?? "—"}</p>
                        </td>
                        <td class="px-6 py-4 text-sm text-slate-500">{formatDate(method.updatedAt)}</td>
                        <td class="px-6 py-4 text-center">
                          <Badge variant={method.status === "ACTIVE" ? "success" : "secondary"} size="sm">
                            {method.status}
                          </Badge>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
            <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
              <p class="text-sm text-slate-500">
                Showing <span class="font-medium text-slate-700">{filteredMethods().length}</span> of{" "}
                <span class="font-medium text-slate-700">{methods().length}</span> payment methods
              </p>
            </div>
          </Card>
        </Suspense>

        <Suspense fallback={null}>
          <div class="mt-8 p-5 bg-gradient-to-br from-primary-green-50 to-emerald-50 border border-primary-green-100 rounded-2xl flex gap-4 shadow-sm">
            <div class="p-2 bg-primary-green-700 rounded-xl text-white shadow-md flex-shrink-0">
              <PaymentsIcon class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-primary-green-950">Buyer checkout preview</h4>
              <p class="text-xs text-primary-green-900/80 mt-1 leading-relaxed">
                Active methods below will appear on the checkout payment step. Currently active:{" "}
                <span class="font-semibold">
                  {methods()
                    .filter((m) => m.status === "ACTIVE")
                    .map((m) => m.displayName)
                    .join(", ") || "None"}
                </span>
              </p>
              <div class="flex flex-wrap gap-2 mt-3">
                <For each={methods().filter((m) => m.status === "ACTIVE")}>
                  {(m) => (
                    <div class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-primary-green-200 shadow-sm">
                      <PaymentMethodLogo method={m} size="sm" />
                      <span class="text-sm font-medium text-slate-800">{m.displayName}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
