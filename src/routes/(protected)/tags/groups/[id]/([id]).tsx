import { createSignal, For, Show, Suspense, createEffect } from "solid-js";
import { A, useParams, createAsync, useNavigate, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import {
    getTagGroupDetail,
    deleteTagGroup,
    updateTagGroup,
    createTag,
    updateTag,
    deleteTag
} from "~/lib/api/taxonomy";
import { TagEditModal } from "~/components/taxonomy/TagEditModal";

export const route: RouteDefinition = {
    preload: ({ params }) => getTagGroupDetail(params.id!),
};

function StatusToggle(props: { checked: boolean; onChange: (checked: boolean) => void; label?: string }) {
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

export default function TagGroupManagementPage() {
    const params = useParams();
    const groupData = createAsync(() => getTagGroupDetail(params.id!));
    const navigate = useNavigate();

    // Local edit state
    const [editName, setEditName] = createSignal("");
    const [editDesc, setEditDesc] = createSignal("");
    const [editActive, setEditActive] = createSignal(true);
    const [newTagName, setNewTagName] = createSignal("");
    const [newTagSlug, setNewTagSlug] = createSignal("");
    const [isNewTagSlugManual, setIsNewTagSlugManual] = createSignal(false);

    // Tag edit modal state
    const [selectedTag, setSelectedTag] = createSignal<any>(null);
    const [showEditModal, setShowEditModal] = createSignal(false);

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    createEffect(() => {
        const data = groupData();
        if (data) {
            setEditName(data.name);
            setEditDesc(data.description || "");
            setEditActive(data.isActive);
        }
    });

    createEffect(() => {
        const name = newTagName();
        if (!isNewTagSlugManual() && name) {
            setNewTagSlug(generateSlug(name));
        }
    });

    const handleSaveChanges = async () => {
        await updateTagGroup({
            id: params.id!,
            name: editName(),
            description: editDesc(),
            isActive: editActive()
        });
    };

    const handleDeleteGroup = async () => {
        if (confirm("Permanently delete this group and all its tags?")) {
            await deleteTagGroup(params.id!);
            navigate("/tags");
        }
    };

    const handleAddTag = async () => {
        if (!newTagName().trim() || !newTagSlug().trim()) return;
        await createTag({
            name: newTagName().trim(),
            slug: newTagSlug().trim(),
            groupId: params.id!
        });
        setNewTagName("");
        setNewTagSlug("");
        setIsNewTagSlugManual(false);
    };

    const toggleTagStatus = async (tag: any) => {
        await updateTag({ id: tag.id, isActive: !tag.isActive });
    };

    const handleDeleteTag = async (tagId: string) => {
        if (confirm("Delete this tag?")) {
            await deleteTag(tagId);
        }
    };

    const handleOpenEdit = (tag: any) => {
        setSelectedTag(tag);
        setShowEditModal(true);
    };

    const handleUpdateTag = async (data: any) => {
        await updateTag(data);
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">
            <Suspense fallback={<div class="animate-pulse space-y-6">
                <div class="h-4 w-32 bg-slate-100 rounded" />
                <div class="h-12 w-full bg-slate-50 rounded-xl" />
                <div class="grid grid-cols-3 gap-8">
                    <div class="h-80 bg-slate-50 rounded-2xl" />
                    <div class="col-span-2 h-80 bg-slate-50 rounded-2xl" />
                </div>
            </div>}>
                <Show when={groupData()}>
                    {(data) => (
                        <>
                            <nav class="flex mb-4 text-sm font-medium text-slate-500">
                                <A href="/tags" class="hover:text-primary-green-700 transition-colors">Tags</A>
                                <span class="mx-2 text-slate-300">/</span>
                                <span class="text-slate-900 font-semibold">{data().name}</span>
                            </nav>

                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <div class="flex items-center gap-3">
                                        <h1 class="text-2xl font-bold text-slate-900">{data().name}</h1>
                                        <span class={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${data().isActive ? 'bg-primary-green-50 text-primary-green-700 border border-primary-green-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                            {data().isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p class="text-sm text-slate-500 mt-1">Management hub for grouping and attribute settings.</p>
                                </div>
                                <div class="flex gap-3">
                                    <Button variant="outline" class="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleDeleteGroup}>
                                        Delete Group
                                    </Button>
                                    <Button variant="primary" onClick={handleSaveChanges}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Column 1: Config */}
                                <div class="lg:col-span-1 space-y-6">
                                    <Card class="p-6">
                                        <h2 class="text-base font-bold text-slate-900 mb-6 underline decoration-primary-green-500/30 underline-offset-8">General Identity</h2>
                                        <div class="space-y-5">
                                            <Input
                                                label="Group Name"
                                                value={editName()}
                                                onInput={(e) => setEditName(e.currentTarget.value)}
                                            />
                                            <div class="space-y-2">
                                                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Description</label>
                                                <textarea
                                                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 transition-all min-h-[100px]"
                                                    value={editDesc()}
                                                    onInput={(e) => setEditDesc(e.currentTarget.value)}
                                                />
                                            </div>
                                            <div class="pt-5 border-t border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <p class="text-sm font-semibold text-slate-900">Active Status</p>
                                                    <p class="text-xs text-slate-500">Enable visibility in catalog filters.</p>
                                                </div>
                                                <StatusToggle checked={editActive()} onChange={setEditActive} />
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Column 2: Items */}
                                <div class="lg:col-span-2 space-y-8">
                                    <Card class="p-6">
                                        <div class="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 class="text-base font-bold text-slate-900">Tag Library</h2>
                                                <p class="text-xs text-slate-500 mt-1">Manage individual tags within this group.</p>
                                            </div>
                                            <div class="px-3 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-500">
                                                {(data().tags || []).length} TOTAL
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-50/50 p-4 rounded-xl border border-slate-100 items-end">
                                            <Input
                                                label="Tag Name *"
                                                placeholder="e.g. Low Light"
                                                value={newTagName()}
                                                onInput={(e) => setNewTagName(e.currentTarget.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                                            />
                                            <div class="flex gap-2 items-end">
                                                <div class="flex-1">
                                                    <Input
                                                        label="Slug *"
                                                        placeholder="e.g. low-light"
                                                        value={newTagSlug()}
                                                        onInput={(e) => {
                                                            setNewTagSlug(e.currentTarget.value);
                                                            setIsNewTagSlugManual(true);
                                                        }}
                                                        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                                                    />
                                                </div>
                                                <Button variant="primary" size="md" onClick={handleAddTag} class="h-[42px]">Add</Button>
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <For each={data().tags} fallback={
                                                <div class="col-span-2 py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                                    No tags registered.
                                                </div>
                                            }>
                                                {(tag) => (
                                                    <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-primary-green-200 transition-all group shadow-sm hover:shadow-md">
                                                        <div class="flex items-center gap-3">
                                                            <StatusToggle checked={tag.isActive} onChange={() => toggleTagStatus(tag)} />
                                                            <div class="flex flex-col">
                                                                <span class="text-sm font-semibold text-slate-900">{tag.name}</span>
                                                                <span class="text-[10px] text-slate-400 font-mono">ID: {tag.id.slice(0, 8)}</span>
                                                            </div>
                                                        </div>
                                                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                            <button
                                                                class="p-2 text-slate-300 hover:text-primary-green-600 transition-all"
                                                                onClick={() => handleOpenEdit(tag)}
                                                                title="Edit Tag"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                class="p-2 text-slate-300 hover:text-red-600 transition-all"
                                                                onClick={() => handleDeleteTag(tag.id)}
                                                                title="Delete Tag"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </Show>
            </Suspense>

            <TagEditModal
                show={showEditModal()}
                tag={selectedTag()}
                onClose={() => setShowEditModal(false)}
                onSave={handleUpdateTag}
            />
        </div>
    );
}
