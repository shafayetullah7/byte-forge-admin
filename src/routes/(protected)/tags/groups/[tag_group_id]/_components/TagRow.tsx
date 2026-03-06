import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import type { Tag, UpdateTagDto } from "~/lib/api/endpoints/tags";

export function StatusToggle(props: { checked: boolean; onChange: (checked: boolean) => void; label?: string }) {
    return (
        <label class="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                class="sr-only peer"
                checked={props.checked}
                onChange={(e) => props.onChange(e.currentTarget.checked)}
            />
            <div class="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green-600"></div>
            {props.label && <span class="ml-3 text-sm font-medium text-slate-700">{props.label}</span>}
        </label>
    );
}

interface TagRowProps {
    tag: Tag;
    onUpdate: (id: string, data: UpdateTagDto) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function TagRow(props: TagRowProps) {
    const [state, setState] = createStore({
        isEditing: false,
        slug: "",
        isSaving: false,
        isConfirmingDelete: false,
    });

    const startEdit = () => {
        setState({
            slug: props.tag.slug,
            isEditing: true,
            isConfirmingDelete: false,
        });
    };

    const handleSave = async () => {
        if (!state.slug.trim()) return;
        setState("isSaving", true);
        try {
            await props.onUpdate(props.tag.id, { slug: state.slug.trim() });
            setState("isEditing", false);
        } finally {
            setState("isSaving", false);
        }
    };

    const toggleStatus = () => {
        props.onUpdate(props.tag.id, { isActive: !props.tag.isActive });
    };

    return (
        <Show
            when={state.isEditing}
            fallback={
                <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all group shadow-sm hover:shadow-md">
                    <div class="flex items-center gap-4">
                        <StatusToggle checked={props.tag.isActive} onChange={toggleStatus} />
                        <div class="flex flex-col">
                            <span class="text-sm font-semibold text-slate-900">{props.tag.name || props.tag.slug}</span>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{props.tag.slug}</span>
                                <span class="text-[10px] text-slate-400">&bull;</span>
                                <span class="text-[10px] text-slate-500">{props.tag.usageCount || 0} uses</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" classList={{ 'opacity-100 md:opacity-100': state.isConfirmingDelete }}>
                        <Show when={!state.isConfirmingDelete} fallback={
                            <div class="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 animate-in fade-in slide-in-from-right-4 duration-200">
                                <span class="text-xs font-medium text-red-800 mr-1">Delete tag?</span>
                                <button
                                    class="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition-colors"
                                    onClick={() => setState("isConfirmingDelete", false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    class="px-2 py-1 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded transition-colors"
                                    onClick={() => { setState("isConfirmingDelete", false); props.onDelete(props.tag.id); }}
                                >
                                    Confirm
                                </button>
                            </div>
                        }>
                            <button
                                class="p-2 text-slate-400 hover:text-primary-green-600 hover:bg-primary-green-50 rounded-lg transition-all"
                                onClick={startEdit}
                                title="Edit Tag"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
                                </svg>
                            </button>
                            <button
                                class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                onClick={() => setState("isConfirmingDelete", true)}
                                title="Delete Tag"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                            </button>
                        </Show>
                    </div>
                </div>
            }
        >
            <div class="p-4 rounded-xl border border-primary-green-200 bg-primary-green-50/30 shadow-sm">
                <div class="space-y-3 mb-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Slug *</label>
                        <input
                            class="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 transition-shadow"
                            value={state.slug}
                            onInput={(e) => setState("slug", e.currentTarget.value)}
                            placeholder="e.g. low-light"
                        />
                    </div>
                    <p class="text-[10px] text-slate-400">To edit the tag name or description, use the Translations tab.</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-primary-green-100 pt-3">
                    <button
                        onClick={() => setState("isEditing", false)}
                        disabled={state.isSaving}
                        class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={state.isSaving}
                        class="px-3 py-1.5 rounded-lg bg-primary-green-600 text-white text-sm hover:bg-primary-green-700 transition-colors disabled:opacity-50"
                    >
                        {state.isSaving ? "Saving..." : "Save Tag"}
                    </button>
                </div>
            </div>
        </Show>
    );
}
