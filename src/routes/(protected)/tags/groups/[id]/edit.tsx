import { TagGroupForm } from "~/components/taxonomy/TagGroupForm";
import { A, useParams } from "@solidjs/router";

const DUMMY_EDIT_DATA = {
    name: "Light Requirements",
    description: "Amount of sunlight a plant needs to thrive indoors or outdoors.",
    isActive: true,
    tags: ["Full Sun", "Partial Shade", "Low Light", "Bright Indirect"]
};

export default function EditTagGroupPage() {
    const params = useParams();

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
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900">Edit Tag Group</h1>
                        <p class="text-sm text-slate-500 mt-1">
                            Modifying settings for Group ID: {params.id}
                        </p>
                    </div>
                    <span class="inline-flex px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold uppercase tracking-wider border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
                        Delete Group
                    </span>
                </div>
            </div>

            <TagGroupForm isEdit={true} initialValues={DUMMY_EDIT_DATA} />

        </div>
    );
}
