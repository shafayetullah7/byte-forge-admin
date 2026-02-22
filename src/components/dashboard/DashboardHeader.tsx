export function DashboardHeader() {
    return (
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                <p class="text-sm text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>
            <div class="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm w-fit">
                <button class="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-900 rounded shadow-sm">Last 30 Days</button>
                <button class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Q3 2023</button>
                <button class="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">YTD</button>
            </div>
        </div>
    );
}
