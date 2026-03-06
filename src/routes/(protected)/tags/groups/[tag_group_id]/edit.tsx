import { createSignal, Show, Suspense } from "solid-js";
import { useNavigate, useParams, createAsync, useAction, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
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
import type { TagGroup, TagGroupTranslation, UpsertTagGroupTranslationDto } from "~/lib/api/endpoints/tag-groups/tag-groups.types";
import { TranslationManager } from "~/components/taxonomy/TranslationManager";
import { EditTagGroupForm } from "~/components/taxonomy/TagGroupForm";

export const route: RouteDefinition = {
    preload: ({ params }) => {
        getTagGroupDetail(params.tag_group_id!);
        getTagGroupTranslations(params.tag_group_id!);
    }
};

function EditContent(props: { group: TagGroup; translations: TagGroupTranslation[] }) {
    const params = useParams();
    const navigate = useNavigate();
    const [deleteError, setDeleteError] = createSignal("");

    // ─── Actions ──────────────────────────────────────────────────────────────────
    const deleteGroupAction = useAction(deleteTagGroup);
    const upsertTranslationAction = useAction(upsertTagGroupTranslation);
    const deleteTranslationAction = useAction(deleteTagGroupTranslation);

    const handleDeleteGroup = async () => {
        setDeleteError("");
        try {
            await deleteGroupAction(props.group.id);
            navigate("/tags");
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete group.");
        }
    };

    const handleUpsertTranslation = async (dto: UpsertTagGroupTranslationDto) => {
        await upsertTranslationAction(params.tag_group_id!, dto);
    };

    const handleDeleteTranslation = async (locale: string) => {
        await deleteTranslationAction(params.tag_group_id!, locale);
    };

    return (
        <EditTagGroupForm group={props.group}>
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
        </EditTagGroupForm>
    );
}

export default function EditTagGroupPage() {
    const params = useParams();

    const groupData = createAsync(() => getTagGroupDetail(params.tag_group_id!));
    const translationsData = createAsync(() => getTagGroupTranslations(params.tag_group_id!));

    const data = () => {
        const g = groupData();
        const t = translationsData();
        return g && t ? { group: g, translations: t } : undefined;
    };

    return (
        <Suspense fallback={
            <div class="animate-pulse px-6 py-8 mx-auto max-w-[1400px] space-y-4">
                <div class="h-4 w-32 bg-slate-100 rounded" />
                <div class="h-8 w-64 bg-slate-100 rounded" />
                <div class="h-64 bg-slate-50 rounded-2xl" />
            </div>
        }>
            <Show when={data()}>
                {(d) => <EditContent group={d().group} translations={d().translations} />}
            </Show>
        </Suspense>
    );
}
