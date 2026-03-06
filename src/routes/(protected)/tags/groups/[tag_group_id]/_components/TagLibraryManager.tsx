import { createSignal, For, Show, Suspense, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { slugify } from "~/lib/utils/slugify";
import type { Tag, UpdateTagDto } from "~/lib/api/endpoints/tags";
import { TagRow } from "./TagRow";

interface TagLibraryManagerProps {
    groupName: string;
    tags: Tag[] | undefined;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onAddTag: (data: { nameEn: string; nameBn: string; slug: string }) => Promise<void>;
    onUpdateTag: (id: string, data: UpdateTagDto) => Promise<void>;
    onDeleteTag: (id: string) => Promise<void>;
    isAdding: boolean;
}

export function TagLibraryManager(props: TagLibraryManagerProps) {
    const [newTagForm, setNewTagForm] = createStore({
        name: "",
        nameBn: "",
        slug: "",
        isSlugManual: false
    });

    const handleNameInput = (name: string) => {
        setNewTagForm("name", name);
        if (!newTagForm.isSlugManual) {
            setNewTagForm("slug", slugify(name));
        }
    };

    const handleSlugInput = (slug: string) => {
        setNewTagForm("slug", slug);
        setNewTagForm("isSlugManual", true);
    };

    const handleAdd = async () => {
        if (!newTagForm.name.trim() || !newTagForm.nameBn.trim() || !newTagForm.slug.trim()) return;

        await props.onAddTag({
            nameEn: newTagForm.name.trim(),
            nameBn: newTagForm.nameBn.trim(),
            slug: newTagForm.slug.trim()
        });

        // Reset local form
        setNewTagForm({
            name: "",
            nameBn: "",
            slug: "",
            isSlugManual: false
        });
    };

    return (
        <Card class="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 class="text-lg font-bold text-slate-900">Tag Library</h2>
                    <p class="text-xs text-slate-500 mt-1">Manage attributes for <span class="text-primary-green-700 font-semibold">{props.groupName}</span></p>
                </div>

                <div class="relative w-full sm:w-64">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-slate-400" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <input
                        type="text"
                        class="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-primary-green-500/20 focus:border-primary-green-500 outline-none hover:border-slate-300"
                        placeholder="Search tags..."
                        value={props.searchQuery}
                        onInput={(e) => props.onSearchChange(e.currentTarget.value)}
                    />
                </div>
            </div>

            {/* Quick Add Toolbar */}
            <div class="mb-8 p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary-green-500"></span>
                    Quick Add Tag
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} class="flex flex-col sm:flex-row flex-wrap gap-3 items-end">
                    <div class="flex-1 min-w-[150px] w-full">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">English (EN) *</label>
                        <input
                            type="text"
                            class="block w-full h-10 rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 border-slate-200 hover:border-slate-300"
                            placeholder="e.g. Low Light"
                            value={newTagForm.name}
                            onInput={(e) => handleNameInput(e.currentTarget.value)}
                            disabled={props.isAdding}
                        />
                    </div>
                    <div class="flex-1 min-w-[150px] w-full">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Bengali (BN) *</label>
                        <input
                            type="text"
                            class="block w-full h-10 rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 border-slate-200 hover:border-slate-300"
                            placeholder="e.g. কম আলো"
                            value={newTagForm.nameBn}
                            onInput={(e) => setNewTagForm("nameBn", e.currentTarget.value)}
                            disabled={props.isAdding}
                        />
                    </div>
                    <div class="flex-1 min-w-[150px] w-full">
                        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Tag Slug *</label>
                        <input
                            type="text"
                            class="block w-full h-10 rounded-xl border bg-white px-3 py-2 text-sm transition-all focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 border-slate-200 hover:border-slate-300"
                            placeholder="e.g. low-light"
                            value={newTagForm.slug}
                            onInput={(e) => handleSlugInput(e.currentTarget.value)}
                            disabled={props.isAdding}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        class="h-10 w-full sm:w-auto px-8 shadow-sm hover:shadow-md transition-all active:scale-95"
                        isLoading={props.isAdding}
                        disabled={!newTagForm.name.trim() || !newTagForm.nameBn.trim() || !newTagForm.slug.trim()}
                    >
                        + Add Tag
                    </Button>
                </form>
            </div>

            {/* Tag List */}
            <SafeErrorBoundary fallback={(err, reset) => <InlineErrorFallback error={err} reset={reset} label="tag list" />}>
                <div class="space-y-3">
                    <Show when={props.tags?.length === 0}>
                        <div class="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                            <div class="mb-2 opacity-20 flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5 4 4" /><path d="M13 7 8.707 11.293a1 1 0 0 0 0 1.414L14.293 18.293a1 1 0 0 0 1.414 0L20 14" /><path d="m9 2 2 2" /><path d="m2 9 2 2" /><path d="M7 21a2 2 0 0 0 4 0" /><path d="M17 21a2 2 0 0 0 4 0" /></svg>
                            </div>
                            <p class="text-sm font-medium">{props.searchQuery ? "No tags match your search." : "No tags in this group yet."}</p>
                            <p class="text-[10px] mt-1 text-slate-400 uppercase tracking-widest">Start by adding one above</p>
                        </div>
                    </Show>
                    <For each={props.tags}>
                        {(tag) => (
                            <TagRow
                                tag={tag}
                                onUpdate={props.onUpdateTag}
                                onDelete={props.onDeleteTag}
                            />
                        )}
                    </For>
                </div>
            </SafeErrorBoundary>
        </Card>
    );
}
