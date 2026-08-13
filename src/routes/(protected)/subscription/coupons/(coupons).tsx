import { createMemo, createSignal, Suspense } from "solid-js";
import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { ClipboardDocumentListIcon } from "~/components/icons";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { getSubscriptionCoupons } from "~/lib/api/endpoints/subscription-coupons";
import { SubscriptionCouponsTable } from "./_components/SubscriptionCouponsTable";

export const route: RouteDefinition = {
  preload: () => getSubscriptionCoupons(),
};

type StatusFilter = "" | "active" | "inactive";

export default function SubscriptionCouponsPage() {
  const couponsData = createAsync(() => getSubscriptionCoupons());
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<StatusFilter>("");

  const coupons = () => couponsData() ?? [];

  const filteredCoupons = createMemo(() => {
    const q = searchQuery().toLowerCase().trim();
    const status = statusFilter();
    return coupons().filter((coupon) => {
      const matchesSearch = !q || coupon.code.toLowerCase().includes(q);
      const matchesStatus =
        !status ||
        (status === "active" && coupon.isActive) ||
        (status === "inactive" && !coupon.isActive);
      return matchesSearch && matchesStatus;
    });
  });

  const metrics = createMemo(() => {
    const all = coupons();
    const active = all.filter((c) => c.isActive).length;
    const redemptions = all.reduce((sum, c) => sum + c.redemptionCount, 0);
    return [
      { label: "Total Coupons", value: String(all.length), subValue: "Subscription codes" },
      { label: "Active", value: String(active), subValue: "Redeemable now" },
      {
        label: "Inactive",
        value: String(all.length - active),
        subValue: "Deactivated / hidden",
      },
      { label: "Total redemptions", value: String(redemptions), subValue: "All-time uses" },
    ];
  });

  const filterButtonClass = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
      active ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Subscription Coupons | ByteForge Admin</Title>
        <Meta name="description" content="Manage seller subscription coupons" />

        <PageHeader
          title="Subscription Coupons"
          description="Create coupon codes that extend seller subscription periods. One coupon per shop — no stacking."
          icon={ClipboardDocumentListIcon}
        >
          <A href="/subscription/coupons/create">
            <Button variant="primary" size="md">
              Add Coupon
            </Button>
          </A>
        </PageHeader>

        <Suspense fallback={<div class="h-24 bg-slate-50 rounded-2xl animate-pulse mb-8" />}>
          <TagMetricsPanel metrics={metrics()} />
        </Suspense>

        <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="w-full sm:max-w-[400px]">
            <Input
              label="Search"
              placeholder="Search by coupon code..."
              class="w-full"
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button type="button" class={filterButtonClass(statusFilter() === "")} onClick={() => setStatusFilter("")}>
              All
            </button>
            <button type="button" class={filterButtonClass(statusFilter() === "active")} onClick={() => setStatusFilter("active")}>
              Active
            </button>
            <button type="button" class={filterButtonClass(statusFilter() === "inactive")} onClick={() => setStatusFilter("inactive")}>
              Inactive
            </button>
          </div>
        </div>

        <Suspense
          fallback={
            <div class="overflow-hidden border border-slate-200 rounded-2xl h-96 animate-pulse bg-slate-50" />
          }
        >
          <SubscriptionCouponsTable coupons={filteredCoupons()} />
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
