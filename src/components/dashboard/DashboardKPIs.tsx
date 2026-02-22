import { PaymentsIcon, StorefrontIcon, VerifiedUserIcon, ArrowTrendingUpIcon } from "~/components/icons";

export function DashboardKPIs() {
    return (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-[130px]">
                <div class="flex justify-between items-start">
                    <span class="text-sm font-medium text-slate-500">Total Revenue</span>
                    <div class="p-2 bg-slate-50 text-primary-green rounded-lg">
                        <PaymentsIcon class="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <div class="flex items-end gap-2 mb-1">
                        <span class="text-2xl font-extrabold text-slate-900">$124,592</span>
                    </div>
                    <div class="flex items-center gap-1 text-xs">
                        <ArrowTrendingUpIcon class="w-3 h-3 text-emerald-600" />
                        <span class="text-emerald-600 font-medium">+12.5%</span>
                        <span class="text-slate-500">vs last month</span>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-[130px]">
                <div class="flex justify-between items-start">
                    <span class="text-sm font-medium text-slate-500">Active Vendors</span>
                    <div class="p-2 bg-slate-50 text-indigo-600 rounded-lg">
                        <StorefrontIcon class="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <div class="flex items-end gap-2 mb-1">
                        <span class="text-2xl font-extrabold text-slate-900">842</span>
                    </div>
                    <div class="flex items-center gap-1 text-xs">
                        <ArrowTrendingUpIcon class="w-3 h-3 text-emerald-600" />
                        <span class="text-emerald-600 font-medium">+5.2%</span>
                        <span class="text-slate-500">new this month</span>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between h-[130px]">
                <div class="flex justify-between items-start">
                    <span class="text-sm font-medium text-slate-500">Pending Approvals</span>
                    <div class="p-2 bg-slate-50 text-amber-600 rounded-lg">
                        <VerifiedUserIcon class="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <div class="flex items-end gap-2 mb-1">
                        <span class="text-2xl font-extrabold text-slate-900">18</span>
                    </div>
                    <div class="flex items-center gap-1 text-xs">
                        <ArrowTrendingUpIcon class="w-3 h-3 text-red-600" />
                        <span class="text-red-600 font-medium">+2</span>
                        <span class="text-slate-500">since yesterday</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
