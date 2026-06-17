import { Title, Meta } from "@solidjs/meta";
import {
    DashboardKPIs,
    DashboardSalesChart,
    DashboardPendingApprovals,
    DashboardRecentActivity
} from "~/components/dashboard";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";

export default function DashboardPage() {
    return (
        <PageShell class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Title>Overview | ByteForge Admin</Title>
            <Meta name="description" content="ByteForge Admin Dashboard Overview" />

            <PageHeader
                title="Overview"
                description="Welcome back, here's what's happening today."
            >
                <div class="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm w-fit">
                    <button class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-900 rounded shadow-sm">Last 30 Days</button>
                    <button class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Q3 2023</button>
                    <button class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">YTD</button>
                </div>
            </PageHeader>

            <DashboardKPIs />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                    <DashboardSalesChart />
                    <DashboardPendingApprovals />
                </div>

                <DashboardRecentActivity />
            </div>
        </PageShell>
    );
}
