import { createSignal, Show, Suspense, onCleanup } from "solid-js";
import { A, useParams, createAsync, useNavigate, useAction, type RouteDefinition } from "@solidjs/router";
import { Card } from "~/components/ui/Card";
import {
    getTagGroupDetail,
    getTagGroupTranslations,
} from "~/lib/api/endpoints/tag-groups";
import {
    deleteTagGroup,
    upsertTagGroupTranslation,
    deleteTagGroupTranslation,
    updateTagGroup
} from "~/lib/api/endpoints/tag-groups/tag-groups.actions";
import type { TagGroup, TagGroupTranslation } from "~/lib/api/endpoints/tag-groups";
import {
    getTagsByGroup,
} from "~/lib/api/endpoints/tags";
import {
    createTag,
    updateTag,
    deleteTag,
    upsertTagTranslation,
    deleteTagTranslation,
} from "~/lib/api/endpoints/tags/tags.actions";
import { TranslationManager } from "~/components/taxonomy/TranslationManager";
import { SafeErrorBoundary } from "~/components/errors";
import { Button } from "~/components/ui/Button";

// Route-local "Page Breakdown" Components
import { TagGroupSettingsCard } from "./_components/TagGroupSettingsCard";
import { TagLibraryManager } from "./_components/TagLibraryManager";
import type { UpdateTagGroupFormData } from "~/schemas/tag-group.schema";

export const route: RouteDefinition = {
    preload: ({ params }) => {
        getTagGroupDetail(params.tag_group_id!);
        getTagGroupTranslations(params.tag_group_id!);
        getTagsByGroup({ groupId: params.tag_group_id!, limit: 50 });
    }
};

function HubContent(props: { groupData: TagGroup; translations: TagGroupTranslation[] }) {
    const params = useParams();
    const navigate = useNavigate();

    // ─── Actions ──────────────────────────────────────────────────────────────────
    const createTagAction = useAction(createTag);
    const updateTagAction = useAction(updateTag);
    const deleteTagAction = useAction(deleteTag);
    const updateGroupAction = useAction(updateTagGroup);
    const upsertTranslationAction = useAction(upsertTagGroupTranslation);
    const deleteTranslationAction = useAction(deleteTagGroupTranslation);
    const deleteGroupAction = useAction(deleteTagGroup);

    // Tag Translation Actions
    const upsertTagTranslationAction = useAction(upsertTagTranslation);
    const deleteTagTranslationAction = useAction(deleteTagTranslation);

    // ─── Search State ───
    const [searchQuery, setSearchQuery] = createSignal("");
    const [debouncedSearch, setDebouncedSearch] = createSignal("");
    let searchTimeout: ReturnType<typeof setTimeout>;

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => setDebouncedSearch(val), 300);
    };

    onCleanup(() => clearTimeout(searchTimeout));

    const tagListData = createAsync(() => getTagsByGroup({
        groupId: params.tag_group_id!,
        limit: 50,
        search: debouncedSearch() || undefined
    }));

    // ─── Unified Update Logic (The "Brain") ───
    const [isSavingSettings, setIsSavingSettings] = createSignal(false);

    const handleSaveSettings = async (values: UpdateTagGroupFormData) => {
        setIsSavingSettings(true);
        try {
            const initialNameEn = props.translations.find(t => t.locale === "en")?.name || "";
            const initialNameBn = props.translations.find(t => t.locale === "bn")?.name || "";

            const promises: Promise<any>[] = [
                updateGroupAction(props.groupData.id, {
                    slug: values.slug?.trim(),
                    isActive: values.isActive,
                })
            ];

            if (values.nameEn && values.nameEn.trim() !== initialNameEn) {
                promises.push(upsertTranslationAction(props.groupData.id, { locale: "en", name: values.nameEn.trim() }));
            }
            if (values.nameBn && values.nameBn.trim() !== initialNameBn) {
                promises.push(upsertTranslationAction(props.groupData.id, { locale: "bn", name: values.nameBn.trim() }));
            }

            await Promise.all(promises);
        } catch (err: any) {
            setDeleteError(err.message || "Failed to update settings.");
        } finally {
            setIsSavingSettings(false);
        }
    };

    // ─── Tag Actions ───
    const [isAddingTag, setIsAddingTag] = createSignal(false);

    const handleAddTag = async (data: { nameEn: string; nameBn: string; slug: string }) => {
        setIsAddingTag(true);
        try {
            await createTagAction(params.tag_group_id!, {
                slug: data.slug,
                translations: [
                    { locale: "en", name: data.nameEn },
                    { locale: "bn", name: data.nameBn }
                ]
            });
        } finally {
            setIsAddingTag(false);
        }
    };

    // ─── Delete Group ───
    const [deleteError, setDeleteError] = createSignal("");
    const handleDeleteGroup = async () => {
        setDeleteError("");
        if ((tagListData()?.length || 0) > 0) {
            setDeleteError("Cannot delete group: It still contains active tags.");
            return;
        }
        try {
            await deleteGroupAction(params.tag_group_id!);
            navigate("/tags");
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete group.");
        }
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1500px]">
            {/* Breadcrumbs */}
            <nav class="flex mb-4 text-sm font-medium text-slate-500 bg-slate-50/50 w-fit px-3 py-1.5 rounded-full border border-slate-100">
                <A href="/tags" class="hover:text-primary-green-700 transition-colors">Tag Library</A>
                <span class="mx-2 text-slate-300">/</span>
                <span class="text-slate-900 font-semibold">{props.groupData.name || props.groupData.slug}</span>
            </nav>

            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* ─── LEFT COLUMN: Group Settings ─── */}
                <div class="xl:col-span-4 space-y-6 xl:sticky xl:top-8">
                    <TagGroupSettingsCard
                        group={props.groupData}
                        translations={props.translations}
                        onSave={handleSaveSettings}
                        isSaving={isSavingSettings()}
                    />

                    <Card class="p-6 border-slate-200 shadow-sm">
                        <div class="mb-6">
                            <h2 class="text-xs font-bold text-slate-800 uppercase tracking-widest">Other Languages</h2>
                            <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Translations beyond En and Bn</p>
                        </div>
                        <TranslationManager
                            translations={props.translations}
                            onUpsert={async (dto) => { await upsertTranslationAction(params.tag_group_id!, dto); }}
                            onDelete={(locale) => deleteTranslationAction(params.tag_group_id!, locale)}
                            hideMandatory
                        />
                    </Card>

                    <Card class="p-6 border-red-100 bg-red-50/20 shadow-sm ring-1 ring-red-500/10">
                        <h2 class="text-xs font-bold text-red-700 uppercase tracking-widest mb-1.5">Danger Zone</h2>
                        <p class="text-[10px] text-red-600/80 mb-4">Permanently remove this group and all associations.</p>
                        <Show when={deleteError()}>
                            <div class="mb-4 p-3 rounded-xl bg-white border border-red-200 text-[10px] text-red-800 font-medium">
                                {deleteError()}
                            </div>
                        </Show>
                        <Button variant="outline" class="w-full text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 h-9 text-xs transition-colors" onClick={handleDeleteGroup}>
                            Delete Group
                        </Button>
                    </Card>
                </div>

                {/* ─── RIGHT COLUMN: Tag Library ─── */}
                <div class="xl:col-span-8">
                    <Suspense fallback={<Card class="h-96 animate-pulse bg-slate-50 border-slate-200"><div /></Card>}>
                        <TagLibraryManager
                            groupName={props.groupData.name || props.groupData.slug}
                            tags={tagListData()}
                            searchQuery={searchQuery()}
                            onSearchChange={handleSearchChange}
                            onAddTag={handleAddTag}
                            onUpdateTag={async (id, dto) => { await updateTagAction(id, dto); }}
                            onDeleteTag={async (tagId) => { await deleteTagAction(tagId); }}
                            onUpsertTagTranslation={async (tagId, dto) => { await upsertTagTranslationAction(tagId, dto); }}
                            onDeleteTagTranslation={async (tagId, locale) => { await deleteTagTranslationAction(tagId, locale); }}
                            isAdding={isAddingTag()}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default function TagGroupManagementPage() {
    const params = useParams();
    const groupData = createAsync(() => getTagGroupDetail(params.tag_group_id!));
    const translationsData = createAsync(() => getTagGroupTranslations(params.tag_group_id!));

    return (
        <Suspense fallback={
            <div class="animate-pulse space-y-6 px-6 py-8 mx-auto max-w-[1500px]">
                <div class="h-8 w-64 bg-slate-100 rounded-full mb-8" />
                <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div class="xl:col-span-4 h-[600px] bg-slate-50 rounded-2xl border border-slate-100 animate-pulse" />
                    <div class="xl:col-span-8 h-[600px] bg-slate-50 rounded-2xl border border-slate-100 animate-pulse" />
                </div>
            </div>
        }>
            <Show when={groupData() && translationsData()}>
                <HubContent groupData={groupData()!} translations={translationsData()!} />
            </Show>
        </Suspense>
    );
}
