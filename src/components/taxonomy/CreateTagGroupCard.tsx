import { A } from "@solidjs/router";

export function CreateTagGroupCard() {
    return (
        <A
            href="/tags/groups/create"
            class="flex flex-col items-center justify-center p-6 h-full min-h-[160px] rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-green-500 hover:bg-slate-50 transition-colors text-center group"
        >
            <div class="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-primary-green-100 flex items-center justify-center mb-3 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500 group-hover:text-primary-green-700">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </div>
            <h3 class="text-sm font-semibold text-slate-900 group-hover:text-primary-green-800">
                Create New Tag Group
            </h3>
            <p class="text-xs text-slate-500 mt-1">
                Add a new attribute category
            </p>
        </A>
    );
}
