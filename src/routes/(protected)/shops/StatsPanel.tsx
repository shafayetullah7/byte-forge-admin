import { createMemo, Suspense } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getShopStats } from "~/lib/api/endpoints/shops";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";

/**
 * Isolated stats panel with its own reactive owner.
 * 
 * This component is intentionally separated from ShopsPageIndex to break
 * the reactive owner chain. The metrics memo here cannot be dirtied by
 * shopsData changes in the parent component.
 * 
 * @see https://docs.solidjs.com/concepts/reactivity/reactive-owners
 */
export function StatsPanel() {
  // This createAsync lives in its OWN reactive owner.
  // Nothing in ShopsPageIndex can dirty this signal.
  const statsData = createAsync(() => getShopStats());

  // Metrics memo - isolated from shops pagination
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

  return <TagMetricsPanel metrics={metrics()} />;
}
