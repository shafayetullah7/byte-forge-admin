export function DashboardRecentActivity() {
    return (
        <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-fit">
            <h2 class="text-base font-semibold text-slate-900 mb-6">Recent Activity</h2>
            <div class="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                <div class="relative pl-6">
                    <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary-green outline outline-4 outline-white shadow-sm"></div>
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-slate-900">New Vendor Registration</span>
                        <span class="text-xs text-slate-500 mt-1 leading-relaxed">GreenLeaf Nursery submitted required verification documents.</span>
                        <span class="text-xs text-slate-400 mt-2 font-medium">10 mins ago</span>
                    </div>
                </div>
                <div class="relative pl-6">
                    <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 outline outline-4 outline-white shadow-sm"></div>
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-slate-900">High Value Order</span>
                        <span class="text-xs text-slate-500 mt-1 leading-relaxed">Order #8921 processed for $2,400.</span>
                        <span class="text-xs text-slate-400 mt-2 font-medium">45 mins ago</span>
                    </div>
                </div>
                <div class="relative pl-6">
                    <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 outline outline-4 outline-white shadow-sm"></div>
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-slate-900">Stock Warning</span>
                        <span class="text-xs text-slate-500 mt-1 leading-relaxed">Ficus Lyrata inventory low for Vendor ID #44.</span>
                        <span class="text-xs text-slate-400 mt-2 font-medium">2 hours ago</span>
                    </div>
                </div>
            </div>
            <div class="mt-8 text-center border-t border-slate-100 pt-5">
                <button class="text-sm text-primary-green font-medium hover:underline underline-offset-4">View All Activity</button>
            </div>
        </div>
    );
}
