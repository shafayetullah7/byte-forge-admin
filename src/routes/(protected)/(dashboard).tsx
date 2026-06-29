import { Title, Meta } from "@solidjs/meta";
import {
  DashboardKPIs,
  DashboardSalesChart,
  DashboardPendingApprovals,
  DashboardRecentActivity,
} from "~/components/dashboard";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";

export default function DashboardPage() {
  return (
    <PageShell class="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-500">
      <Title>Overview | ByteForge Admin</Title>
      <Meta name="description" content="ByteForge Admin Dashboard Overview" />

      <PageHeader
        title="Overview"
        description="Operational snapshot for marketplace support."
      />

      <DashboardKPIs />

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <DashboardSalesChart />
          <DashboardPendingApprovals />
        </div>

        <DashboardRecentActivity />
      </div>
    </PageShell>
  );
}
