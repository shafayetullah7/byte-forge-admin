import { TagGroupForm } from "~/components/taxonomy/TagGroupForm";
import { A } from "@solidjs/router";

export default function CreateTagGroupPage() {
    return (
        <div class="px-6 py-8 mx-auto max-w-[900px]">

            <div class="mb-6">
                <A href="/tags" class="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-green-700 transition-colors mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Library
                </A>
                <h1 class="text-2xl font-bold text-slate-900">Create Tag Group</h1>
                <p class="text-sm text-slate-500 mt-1">
                    Define a new taxonomy group and configure its initial attributes.
                </p>
            </div>

            <TagGroupForm isEdit={false} />

        </div>
    );
}
