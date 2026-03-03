import { CreateTagGroupForm } from "~/components/taxonomy/TagGroupForm";
import { A, type RouteDefinition } from "@solidjs/router";
import { ArrowLeftIcon } from "~/components/icons";

export const route: RouteDefinition = {};

export default function CreateTagGroupPage() {
    return (
        <div class="px-6 py-8 mx-auto max-w-[900px]">

            <div class="mb-6">
                <A href="/tags" class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-green-700 transition-colors mb-4">
                    <ArrowLeftIcon width="16" height="16" />
                    Back to Library
                </A>
                <h1 class="text-2xl font-bold text-slate-900">Create Tag Group</h1>
                <p class="text-sm text-slate-500 mt-1">
                    Define a new taxonomy group and configure its initial attributes.
                </p>
            </div>

            <CreateTagGroupForm />

        </div>
    );
}
