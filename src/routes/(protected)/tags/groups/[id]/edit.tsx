import { createSignal, Show, Suspense } from "solid-js";
import { createStore } from "solid-js/store";
import { A, createAsync, useNavigate, useParams, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import {
    deleteTagGroup,
    getTagGroupDetail,
    getTagGroupTranslations,
    upsertTagGroupTranslation,
    deleteTagGroupTranslation
} from "~/lib/api/endpoints/tag-groups";
import type { TagGroup, TagGroupTranslation, UpsertTagGroupTranslationDto } from "~/lib/api/endpoints/tag-groups";
import { updateTagGroup } from "~/lib/api/endpoints/tag-groups";
import { TranslationManager } from "~/components/taxonomy/TranslationManager";
import { StatusToggle } from "~/components/taxonomy/TagRow";

export const route: RouteDefinition = {
    preload: ({ params }) => {
        getTagGroupDetail(params.id!);
        getTagGroupTranslations(params.id!);
    }
};

// Inner component receives data as props — no createEffect needed for initialization.
function EditContent(props: { group: TagGroup; translations: TagGroupTranslation[] }) {
    const params = useParams();
    const navigate = useNavigate();

    const [form, setForm] = createStore({
        isActive: props.group.isActive,
    });

    const [isSaving, setIsSaving] = createSignal(false);
    const [deleteError, setDeleteError] = createSignal("");

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            await updateTagGroup(props.group.id, { isActive: form.isActive });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteGroup = async () => {
        setDeleteError("");
        try {
            await deleteTagGroup(props.group.id);
            navigate("/tags");
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete group.");
        }
    };

    const handleUpsertTranslation = async (dto: UpsertTagGroupTranslationDto) => {
        await upsertTagGroupTranslation(params.id!, dto);
    };

    const handleDeleteTranslation = async (locale: string) => {
        await deleteTagGroupTranslation(params.id!, locale);
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[900px]">
            {/* Back Nav */}
            <A
                href={`/tags/groups/${props.group.id}`}
                class="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-green-700 transition-colors mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Tag Group
            </A>

            <h1 class="text-2xl font-bold text-slate-900 mb-1">Edit: {props.group.name || props.group.slug}</h1>
            <p class="text-sm text-slate-500 mb-8">Manage settings and translations for this tag group.</p>

            <div class="space-y-6">
                {/* Settings Card */}
                <Card class="p-6">
                    <h2 class="text-base font-bold text-slate-900 mb-6">Group Settings</h2>

                    <div class="space-y-5">
                        <div>
                            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Slug</p>
                            <p class="text-sm font-mono text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{props.group.slug}</p>
                            <p class="text-[10px] text-slate-400 mt-1">Slugs cannot be changed after creation to preserve data integrity.</p>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                            <div>
                                <p class="text-sm font-medium text-slate-900">Active Status</p>
                                <p class="text-xs text-slate-500 mt-0.5">Toggle whether this group is visible globally.</p>
                            </div>
                            <StatusToggle checked={form.isActive} onChange={(v) => setForm("isActive", v)} />
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <Button variant="primary" onClick={handleSaveSettings} isLoading={isSaving()}>
                            Save Settings
                        </Button>
                    </div>
                </Card>

                {/* Translations Card */}
                <Card class="p-6">
                    <h2 class="text-base font-bold text-slate-900 mb-1">Translations</h2>
                    <p class="text-xs text-slate-500 mb-6">Manage names and descriptions across locales for this group.</p>
                    <TranslationManager
                        translations={props.translations}
                        onUpsert={handleUpsertTranslation}
                        onDelete={handleDeleteTranslation}
                    />
                </Card>

                {/* Danger Zone */}
                <Card class="p-6 border-red-100 bg-red-50/30">
                    <h2 class="text-sm font-bold text-red-700 mb-1">Danger Zone</h2>
                    <p class="text-xs text-red-600/80 mb-4">Permanently remove this group. All tags must be deleted first.</p>
                    <Show when={deleteError()}>
                        <div class="mb-4 p-3 rounded-lg bg-red-100 text-xs text-red-800 border border-red-200">
                            {deleteError()}
                        </div>
                    </Show>
                    <Button variant="outline" class="text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300" onClick={handleDeleteGroup}>
                        Delete Group
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default function EditTagGroupPage() {
    const params = useParams();

    const groupData = createAsync(() => getTagGroupDetail(params.id!));
    const translationsData = createAsync(() => getTagGroupTranslations(params.id!));

    return (
        <Suspense fallback={
            <div class="animate-pulse px-6 py-8 mx-auto max-w-[900px] space-y-4">
                <div class="h-4 w-32 bg-slate-100 rounded" />
                <div class="h-8 w-64 bg-slate-100 rounded" />
                <div class="h-64 bg-slate-50 rounded-2xl" />
            </div>
        }>
            <Show when={groupData() && translationsData()}>
                <EditContent group={groupData()!} translations={translationsData()!} />
            </Show>
        </Suspense>
    );
}
