import { Title, Meta } from "@solidjs/meta";
import {
    DashboardHeader,
    DashboardKPIs,
    DashboardSalesChart,
    DashboardPendingApprovals,
    DashboardRecentActivity
} from "~/components/dashboard";

export default function DashboardPage() {
    return (
        <div class="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Title>Overview | ByteForge Admin</Title>
            <Meta name="description" content="ByteForge Admin Dashboard Overview" />

            {/* Header Section */}
            <DashboardHeader />

            {/* KPI Cards */}
            <DashboardKPIs />

            {/* Layout Split: Charts & Activity */}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Value Area */}
                <div class="lg:col-span-2 space-y-6">
                    <DashboardSalesChart />
                    <DashboardPendingApprovals />
                </div>

                {/* Sidebar Activity Feed */}
                <DashboardRecentActivity />

            </div>
        </div>
    );
}
