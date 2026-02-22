export function DashboardPendingApprovals() {
    return (
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 class="text-base font-semibold text-slate-900">Pending Approvals</h2>
                <button class="text-primary-green text-sm font-medium hover:underline">Manage All</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-white text-[11px] text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th class="px-5 py-3 font-medium">Vendor</th>
                            <th class="px-5 py-3 font-medium">Date Applied</th>
                            <th class="px-5 py-3 font-medium">Status</th>
                            <th class="px-5 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        <tr class="hover:bg-slate-50 transition-colors group">
                            <td class="px-5 py-4">
                                <div class="font-medium text-slate-900">Botanical Haven Ltd.</div>
                                <div class="text-xs text-slate-500 mt-0.5">ID: #V-9021</div>
                            </td>
                            <td class="px-5 py-4 text-slate-500">Oct 24, 2023</td>
                            <td class="px-5 py-4">
                                <span class="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 outline outline-1 outline-amber-200">
                                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                                    Pending Docs
                                </span>
                            </td>
                            <td class="px-5 py-4 text-right">
                                <button class="text-slate-600 hover:text-primary-green font-medium text-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">Review</button>
                            </td>
                        </tr>
                        <tr class="hover:bg-slate-50 transition-colors group">
                            <td class="px-5 py-4">
                                <div class="font-medium text-slate-900">Urban Jungle Co.</div>
                                <div class="text-xs text-slate-500 mt-0.5">ID: #V-9022</div>
                            </td>
                            <td class="px-5 py-4 text-slate-500">Oct 23, 2023</td>
                            <td class="px-5 py-4">
                                <span class="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 outline outline-1 outline-emerald-200">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                    Review Ready
                                </span>
                            </td>
                            <td class="px-5 py-4 text-right">
                                <button class="text-slate-600 hover:text-primary-green font-medium text-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">Review</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
