import { createSignal, For, Show, Suspense, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useParams, createAsync, useNavigate, useAction, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import {
    getTagGroupDetail,
    getTagGroupTranslations,
} from "~/lib/api/endpoints/tag-groups";
import {
    deleteTagGroup,
    upsertTagGroupTranslation,
    deleteTagGroupTranslation
} from "~/lib/api/endpoints/tag-groups/tag-groups.actions";
import type { TagGroup, TagGroupTranslation, UpsertTagGroupTranslationDto } from "~/lib/api/endpoints/tag-groups";
import {
    getTagsByGroup,
} from "~/lib/api/endpoints/tags";
import {
    createTag,
    updateTag,
    deleteTag,
} from "~/lib/api/endpoints/tags/tags.actions";
import type { UpdateTagDto } from "~/lib/api/endpoints/tags";
import { TagRow } from "~/components/taxonomy/TagRow";
import { EditTagGroupForm } from "~/components/taxonomy/TagGroupForm";
import { TranslationManager } from "~/components/taxonomy/TranslationManager";
import { slugify } from "~/lib/utils/slugify";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export const route: RouteDefinition = {
    preload: ({ params }) => {
        getTagGroupDetail(params.tag_group_id!);
        getTagGroupTranslations(params.tag_group_id!);
        getTagsByGroup({ groupId: params.tag_group_id!, limit: 50 });
    }
};

// Extracted inner component to ensure props.data is available for immediate setup
// without needing createEffect.
function HubContent(props: { groupData: TagGroup; translations: TagGroupTranslation[] }) {
    const params = useParams();
    const navigate = useNavigate();

    // ─── Actions ──────────────────────────────────────────────────────────────────
    const createTagAction = useAction(createTag);
    const updateTagAction = useAction(updateTag);
    const deleteTagAction = useAction(deleteTag);
    const upsertTranslationAction = useAction(upsertTagGroupTranslation);
    const deleteTranslationAction = useAction(deleteTagGroupTranslation);
    const deleteGroupAction = useAction(deleteTagGroup);

    // ─── Tag List State ───
    const [searchQuery, setSearchQuery] = createSignal("");
    const [debouncedSearch, setDebouncedSearch] = createSignal("");
    let searchTimeout: ReturnType<typeof setTimeout>;

    const handleSearchInput = (e: Event) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        setSearchQuery(val);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            setDebouncedSearch(val);
        }, 300);
    };

    onCleanup(() => clearTimeout(searchTimeout));

    // Live tag list powered by the dedicated endpoint (allows backend search)
    const tagListData = createAsync(() => getTagsByGroup({
        groupId: params.tag_group_id!,
        limit: 50,
        search: debouncedSearch() || undefined
    }));

    // ─── Delete Group State ───
    const [deleteError, setDeleteError] = createSignal("");

    const handleDeleteGroup = async () => {
        setDeleteError("");
        const data = tagListData();
        if (data && data.length > 0) {
            setDeleteError("Cannot delete group: It still contains active tags. Please delete or move the tags first.");
            return;
        }

        try {
            await deleteGroupAction(params.tag_group_id!);
            navigate("/tags");
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete group.");
        }
    };

    // ─── Inline Add Tag Store ───
    // Replacing 4 signals with a reactive store for better state management
    const [newTagForm, setNewTagForm] = createStore({
        name: "",
        nameBn: "",
        slug: "",
        isSlugManual: false,
        isSubmitting: false
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

    const handleAddTag = async () => {
        if (!newTagForm.name.trim() || !newTagForm.slug.trim()) return;
        setNewTagForm("isSubmitting", true);
        try {
            await createTagAction(params.tag_group_id!, {
                slug: newTagForm.slug.trim(),
                translations: [
                    { locale: "en", name: newTagForm.name.trim() },
                    { locale: "bn", name: newTagForm.nameBn.trim() }
                ]
            });
            // Reset form
            setNewTagForm({
                name: "",
                nameBn: "",
                slug: "",
                isSlugManual: false,
                isSubmitting: false
            });
        } catch (e) {
            setNewTagForm("isSubmitting", false);
        }
    };

    const handleUpdateTag = async (id: string, data: UpdateTagDto) => {
        await updateTagAction(id, data);
    };

    const handleDeleteTag = async (tagId: string) => {
        await deleteTagAction(tagId);
    };

    // ─── Translation Manager Handlers ───
    const handleUpsertTranslation = async (dto: UpsertTagGroupTranslationDto) => {
        await upsertTranslationAction(params.tag_group_id!, dto);
    };

    const handleDeleteTranslation = async (locale: string) => {
        await deleteTranslationAction(params.tag_group_id!, locale);
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">
            {/* Breadcrumbs */}
            <nav class="flex mb-4 text-sm font-medium text-slate-500">
                <A href="/tags" class="hover:text-primary-green-700 transition-colors">Tag Library</A>
                <span class="mx-2 text-slate-300">/</span>
                <span class="text-slate-900 font-semibold">{props.groupData.name || props.groupData.slug}</span>
            </nav>

            {/* Header */}
            <div class="flex items-center gap-3 mb-8">
                <h1 class="text-2xl font-bold text-slate-900">{props.groupData.name || props.groupData.slug}</h1>
                <span class={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${props.groupData.isActive ? 'bg-primary-green-50 text-primary-green-700 border border-primary-green-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    {props.groupData.isActive ? 'Active Group' : 'Inactive Group'}
                </span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* ─── LEFT COLUMN: Group Settings & Translations ─── */}
                <div class="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
                    {/* Using the Edit component refactored earlier */}
                    <EditTagGroupForm group={props.groupData} hideHeader />

                    {/* Translations Box */}
                    <Card class="p-6">
                        <div class="mb-6">
                            <h2 class="text-base font-bold text-slate-900">Group Translations</h2>
                            <p class="text-xs text-slate-500 mt-1">Manage names and descriptions across locales.</p>
                        </div>
                        <TranslationManager
                            translations={props.translations || []}
                            onUpsert={handleUpsertTranslation}
                            onDelete={handleDeleteTranslation}
                        />
                    </Card>

                    {/* Danger Zone */}
                    <Card class="p-6 border-red-100 bg-red-50/30">
                        <div class="mb-4">
                            <h2 class="text-sm font-bold text-red-700">Danger Zone</h2>
                            <p class="text-xs text-red-600/80 mt-1">Permanently remove this group. Tags must be deleted first.</p>
                        </div>
                        <Show when={deleteError()}>
                            <div class="mb-4 p-3 rounded-lg bg-red-100 text-xs text-red-800 border border-red-200">
                                {deleteError()}
                            </div>
                        </Show>
                        <Button variant="outline" class="w-full text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300" onClick={handleDeleteGroup}>
                            Delete Group
                        </Button>
                    </Card>
                </div>

                {/* ─── RIGHT COLUMN: Tag Library ─── */}
                <div class="lg:col-span-2 space-y-6">
                    <Card class="p-6">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 class="text-base font-bold text-slate-900">Tags in {props.groupData.name || props.groupData.slug}</h2>
                                <p class="text-xs text-slate-500 mt-1">Manage the specific attributes within this group.</p>
                            </div>

                            {/* Search box connected to backend */}
                            <div class="relative w-full sm:w-64">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-slate-400" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                                <input
                                    type="text"
                                    class="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 outline-none"
                                    placeholder="Search tags..."
                                    value={searchQuery()}
                                    onInput={handleSearchInput}
                                />
                            </div>
                        </div>

                        {/* Inline Add Tag Form (Using createStore pattern) */}
                        <div class="mb-6 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Add New Tag</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddTag(); }} class="space-y-4">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input
                                        label="Tag Name (English) *"
                                        placeholder="e.g. Low Light"
                                        value={newTagForm.name}
                                        onInput={(e) => handleNameInput(e.currentTarget.value)}
                                    />
                                    <Input
                                        label="Tag Name (Bengali) *"
                                        placeholder="e.g. কম আলো"
                                        value={newTagForm.nameBn}
                                        onInput={(e) => setNewTagForm("nameBn", e.currentTarget.value)}
                                    />
                                </div>
                                <div class="flex flex-col sm:flex-row gap-3 items-end">
                                    <div class="w-full sm:flex-1">
                                        <Input
                                            label="Tag Slug *"
                                            placeholder="e.g. low-light"
                                            value={newTagForm.slug}
                                            onInput={(e) => handleSlugInput(e.currentTarget.value)}
                                        />
                                    </div>
                                    <Button type="submit" variant="primary" class="w-full sm:w-auto" isLoading={newTagForm.isSubmitting} disabled={!newTagForm.name.trim() || !newTagForm.nameBn.trim() || !newTagForm.slug.trim()}>
                                        Add Tag
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Tag List */}
                        <SafeErrorBoundary
                            fallback={(err, reset) => (
                                <InlineErrorFallback error={err} reset={reset} label="tag list" />
                            )}
                        >
                            <Suspense fallback={
                                <div class="space-y-3 animate-pulse">
                                    {[1, 2, 3].map(() => <div class="h-16 bg-slate-100 rounded-xl" />)}
                                </div>
                            }>
                                <div class="space-y-3">
                                    <Show when={tagListData()?.length === 0}>
                                        <div class="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                            {searchQuery() ? "No tags match your search." : "No tags in this group yet."}
                                        </div>
                                    </Show>
                                    <For each={tagListData()}>
                                        {(tag) => (
                                            <TagRow
                                                tag={tag}
                                                onUpdate={handleUpdateTag}
                                                onDelete={handleDeleteTag}
                                            />
                                        )}
                                    </For>
                                </div>
                            </Suspense>
                        </SafeErrorBoundary>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ─── Main Route Shell ───

export default function TagGroupManagementPage() {
    const params = useParams();

    // Data fetch functions initialized here
    const groupData = createAsync(() => getTagGroupDetail(params.tag_group_id!));
    const translationsData = createAsync(() => getTagGroupTranslations(params.tag_group_id!));

    const allData = () => {
        const g = groupData();
        const t = translationsData();
        return g && t ? { group: g, translations: t } : undefined;
    };

    return (
        <Suspense fallback={<div class="animate-pulse space-y-6 px-6 py-8 mx-auto max-w-[1400px]">
            <div class="h-4 w-32 bg-slate-100 rounded" />
            <div class="h-12 w-96 bg-slate-50 rounded-xl" />
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="h-96 bg-slate-50 rounded-2xl" />
                <div class="col-span-2 h-96 bg-slate-50 rounded-2xl" />
            </div>
        </div>}>
            <Show when={allData()}>
                {(data) => <HubContent groupData={data().group} translations={data().translations} />}
            </Show>
        </Suspense>
    );
}
