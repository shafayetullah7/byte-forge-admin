export function DashboardSalesChart() {
    return (
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm min-h-[350px] flex flex-col">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-base font-semibold text-slate-900">Sales Trend</h2>
                <button class="text-primary-green text-sm font-medium hover:underline">View Report</button>
            </div>

            <div class="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center bg-slate-50">
                <div class="text-center">
                    <span class="text-sm text-slate-400 block mb-2 font-medium">Chart Visualization Coming Soon</span>
                    <div class="flex gap-2 justify-center items-end h-32 px-4">
                        <div class="w-8 bg-slate-200 rounded-t-sm h-[40%]"></div>
                        <div class="w-8 bg-slate-200 rounded-t-sm h-[60%]"></div>
                        <div class="w-8 bg-primary-green/30 rounded-t-sm h-[80%]"></div>
                        <div class="w-8 bg-primary-green rounded-t-sm h-[100%]"></div>
                        <div class="w-8 bg-slate-200 rounded-t-sm h-[70%]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
