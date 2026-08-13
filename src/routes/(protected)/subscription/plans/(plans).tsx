import { createMemo, createSignal, Suspense } from "solid-js";
import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { ArrowTrendingUpIcon } from "~/components/icons";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { getSubscriptionPlans } from "~/lib/api/endpoints/subscription-plans";
import { SubscriptionPlansTable } from "./_components/SubscriptionPlansTable";

export const route: RouteDefinition = {
  preload: () => getSubscriptionPlans(),
};

type StatusFilter = "" | "active" | "hidden" | "retired";

export default function SubscriptionPlansPage() {
  const plansData = createAsync(() => getSubscriptionPlans());
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<StatusFilter>("");

  const plans = () => plansData() ?? [];

  const filteredPlans = createMemo(() => {
    const q = searchQuery().toLowerCase().trim();
    const status = statusFilter();
    return plans().filter((plan) => {
      const matchesSearch =
        !q ||
        plan.name.toLowerCase().includes(q) ||
        (plan.description?.toLowerCase().includes(q) ?? false);
      const matchesStatus =
        !status ||
        (status === "retired" && plan.isRetired) ||
        (status === "active" && !plan.isRetired && plan.isActiveForNew) ||
        (status === "hidden" && !plan.isRetired && !plan.isActiveForNew);
      return matchesSearch && matchesStatus;
    });
  });

  const metrics = createMemo(() => {
    const all = plans();
    const active = all.filter((p) => !p.isRetired && p.isActiveForNew).length;
    const synced = all.filter((p) => p.stripePriceId).length;
    return [
      { label: "Total Plans", value: String(all.length), subValue: "Seller billing tiers" },
      { label: "Active for new", value: String(active), subValue: "Visible to sellers" },
      {
        label: "Stripe synced",
        value: String(synced),
        subValue: synced === all.length ? "All ready" : "Some need sync",
      },
      {
        label: "Retired",
        value: String(all.filter((p) => p.isRetired).length),
        subValue: "Grandfathered only",
      },
    ];
  });

  const filterButtonClass = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
      active ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Subscription Plans | ByteForge Admin</Title>
        <Meta name="description" content="Manage seller subscription plans" />

        <PageHeader
          title="Subscription Plans"
          description="Configure seller platform billing tiers. Sync plans to Stripe before sellers can checkout."
          icon={ArrowTrendingUpIcon}
        >
          <A href="/subscription/plans/create">
            <Button variant="primary" size="md">
              Add Plan
            </Button>
          </A>
        </PageHeader>

        <Suspense fallback={<div class="h-24 bg-slate-50 rounded-2xl animate-pulse mb-8" />}>
          <TagMetricsPanel metrics={metrics()} />
        </Suspense>

        <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="relative w-full sm:max-w-[400px]">
            <Input
              label="Search"
              placeholder="Search by name or description..."
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
            <button type="button" class={filterButtonClass(statusFilter() === "hidden")} onClick={() => setStatusFilter("hidden")}>
              Hidden
            </button>
            <button type="button" class={filterButtonClass(statusFilter() === "retired")} onClick={() => setStatusFilter("retired")}>
              Retired
            </button>
          </div>
        </div>

        <Suspense
          fallback={
            <div class="overflow-hidden border border-slate-200 rounded-2xl h-96 animate-pulse bg-slate-50" />
          }
        >
          <SubscriptionPlansTable plans={filteredPlans()} />
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
