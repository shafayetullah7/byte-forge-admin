import { createSignal, Show, Suspense, createEffect, For } from "solid-js";
import { A, useParams, createAsync, useNavigate, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import { FolderIcon } from "~/components/icons";
import {
    getCategoryDetail,
    createCategory,
    updateCategory,
    deleteCategory
} from "~/lib/api/endpoints/categories";

export const route: RouteDefinition = {
    preload: ({ params }) => getCategoryDetail(params.id!),
};

export default function CategoryManagementHub() {
    const params = useParams();
    const navigate = useNavigate();
    const categoryData = createAsync(() => getCategoryDetail(params.id!));

    // Edit state
    const [editName, setEditName] = createSignal("");
    const [editSlug, setEditSlug] = createSignal("");
    const [isEditSlugManual, setIsEditSlugManual] = createSignal(false);
    const [editDesc, setEditDesc] = createSignal("");
    const [editActive, setEditActive] = createSignal(true);
    const [editParentId, setEditParentId] = createSignal<string | null>(null);

    const [showAddSub, setShowAddSub] = createSignal(false);
    const [newSubName, setNewSubName] = createSignal("");
    const [newSubSlug, setNewSubSlug] = createSignal("");
    const [isNewSubSlugManual, setIsNewSubSlugManual] = createSignal(false);

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    createEffect(() => {
        const data = categoryData();
        if (data) {
            setEditName(data.name);
            setEditSlug(data.slug);
            setEditDesc(data.description || "");
            setEditActive(data.isActive);
            setEditParentId(data.parentId || "");
            setIsEditSlugManual(true); // Don't auto-generate from existing data on load
        }
    });

    createEffect(() => {
        const name = editName();
        if (!isEditSlugManual() && name) {
            setEditSlug(generateSlug(name));
        }
    });

    createEffect(() => {
        const name = newSubName();
        if (!isNewSubSlugManual() && name) {
            setNewSubSlug(generateSlug(name));
        }
    });

    const handleSaveChanges = async () => {
        if (!editName().trim() || !editSlug().trim()) return;
        await updateCategory(params.id!, {
            name: editName().trim(),
            slug: editSlug().trim(),
            description: editDesc().trim() || undefined,
            isActive: editActive(),
            parentId: editParentId() || undefined
        });
    };

    const handleDelete = async () => {
        if (confirm("Permanently delete this category? This might affect nested items depending on system rules.")) {
            await deleteCategory(params.id!);
            navigate("/categories");
        }
    };

    const handleAddSub = async () => {
        if (!newSubName().trim() || !newSubSlug().trim()) return;
        await createCategory({
            name: newSubName().trim(),
            slug: newSubSlug().trim(),
            parentId: params.id!,
            isActive: true
        });
        setNewSubName("");
        setNewSubSlug("");
        setIsNewSubSlugManual(false);
        setShowAddSub(false);
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">
            <Suspense fallback={<div class="animate-pulse space-y-4">
                <div class="h-4 w-32 bg-slate-100 rounded" />
                <div class="h-8 w-64 bg-slate-100 rounded" />
                <div class="grid grid-cols-3 gap-8 mt-8">
                    <div class="h-64 bg-slate-50 rounded-2xl" />
                    <div class="col-span-2 h-64 bg-slate-50 rounded-2xl" />
                </div>
            </div>}>
                <Show when={categoryData()}>
                    {(data) => (
                        <>
                            {/* Contextual Header */}
                            <div class="mb-8">
                                <nav class="flex mb-4 text-sm font-medium text-slate-500">
                                    <A href="/categories" class="hover:text-primary-green-700 transition-colors">Categories</A>
                                    <span class="mx-2 text-slate-300">/</span>
                                    <Show when={data().parentName} fallback={<span class="text-slate-400 italic">Root</span>}>
                                        <span class="text-slate-400">{data().parentName}</span>
                                    </Show>
                                    <span class="mx-2 text-slate-300">/</span>
                                    <span class="text-slate-900 font-semibold">{data().name}</span>
                                </nav>

                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-xl bg-primary-green-50 flex items-center justify-center border border-primary-green-100">
                                                <FolderIcon class="w-5 h-5 text-primary-green-700" />
                                            </div>
                                            <div>
                                                <div class="flex items-center gap-2">
                                                    <h1 class="text-2xl font-bold text-slate-900">{data().name}</h1>
                                                    <span class={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${data().isActive ? 'bg-primary-green-50 text-primary-green-700 border border-primary-green-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                        }`}>
                                                        {data().isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <p class="text-sm text-slate-500 mt-0.5">Level {data().depth + 1} Category in Hierarchy</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex gap-3">
                                        <Button variant="outline" class="text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete}>
                                            Delete Category
                                        </Button>
                                        <Button variant="primary" onClick={handleSaveChanges}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Column 1: Configuration Plane (Metadata) */}
                                <div class="lg:col-span-1 space-y-6">
                                    <Card class="p-6">
                                        <h2 class="text-base font-bold text-slate-900 mb-6 flex items-center">
                                            General Identity
                                        </h2>

                                        <div class="space-y-5">
                                            <Input
                                                label="Category Name *"
                                                value={editName()}
                                                onInput={(e) => setEditName(e.currentTarget.value)}
                                            />
                                            <Input
                                                label="Slug Path *"
                                                value={editSlug()}
                                                onInput={(e) => {
                                                    setEditSlug(e.currentTarget.value);
                                                    setIsEditSlugManual(true);
                                                }}
                                            />
                                            <div class="space-y-2">
                                                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Description</label>
                                                <textarea
                                                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 transition-all min-h-[100px]"
                                                    value={editDesc() || data().description || ""}
                                                    onInput={(e) => setEditDesc(e.currentTarget.value)}
                                                />
                                            </div>

                                            <div class="pt-5 border-t border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <p class="text-sm font-semibold text-slate-900">Catalog Visibility</p>
                                                    <p class="text-xs text-slate-500">Show this category on storefront.</p>
                                                </div>
                                                <label class="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" class="sr-only peer" checked={editActive()} onChange={(e) => setEditActive(e.currentTarget.checked)} />
                                                    <div class="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Column 2/3: Operational Plane (Logic & Relationships) */}
                                <div class="lg:col-span-2 space-y-8">

                                    {/* Subcategories Action Plane */}
                                    <Card class="p-6">
                                        <div class="flex items-start justify-between mb-8">
                                            <div>
                                                <h2 class="text-base font-bold text-slate-900">Subcategories</h2>
                                                <p class="text-xs text-slate-500 mt-1">Manage nested categories under {data().name}.</p>
                                            </div>
                                            <Show when={data().depth < 2} fallback={
                                                <div class="px-3 py-1 bg-red-50 border border-red-100 rounded text-[10px] font-bold text-red-700">
                                                    MAX DEPTH REACHED
                                                </div>
                                            }>
                                                <Button variant="secondary" size="sm" onClick={() => setShowAddSub(true)}>
                                                    Add Subcategory
                                                </Button>
                                            </Show>
                                        </div>

                                        <Show when={showAddSub()}>
                                            <div class="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div class="flex justify-between items-center mb-2">
                                                    <h3 class="text-sm font-semibold text-slate-900">New Subcategory</h3>
                                                    <button onClick={() => setShowAddSub(false)} class="text-slate-400 hover:text-slate-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Input
                                                        label="Subcategory Name *"
                                                        placeholder="e.g. Gaming Laptops"
                                                        value={newSubName()}
                                                        onInput={(e) => setNewSubName(e.currentTarget.value)}
                                                    />
                                                    <Input
                                                        label="Slug *"
                                                        placeholder="e.g. gaming-laptops"
                                                        value={newSubSlug()}
                                                        onInput={(e) => {
                                                            setNewSubSlug(e.currentTarget.value);
                                                            setIsNewSubSlugManual(true);
                                                        }}
                                                    />
                                                </div>
                                                <div class="flex justify-end gap-2 pt-2">
                                                    <Button variant="outline" size="sm" onClick={() => setShowAddSub(false)}>Cancel</Button>
                                                    <Button variant="primary" size="sm" onClick={handleAddSub}>Create Subcategory</Button>
                                                </div>
                                            </div>
                                        </Show>

                                        <div class="space-y-3">
                                            <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Existing Subcategories</p>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <For each={data().children} fallback={
                                                    <div class="col-span-2 py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                                        No subcategories created yet.
                                                    </div>
                                                }>
                                                    {(sub) => (
                                                        <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-primary-green-200 transition-all group shadow-sm hover:shadow-md">
                                                            <div class="flex items-center gap-3">
                                                                <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                                                    <FolderIcon class="w-4 h-4 text-slate-400" />
                                                                </div>
                                                                <div class="flex flex-col">
                                                                    <span class="text-sm font-semibold text-slate-900">{sub.name}</span>
                                                                    <span class="text-[10px] text-slate-400">{sub.subCategoryCount || 0} Children</span>
                                                                </div>
                                                            </div>
                                                            <A href={`/categories/${sub.id}`} class="text-[10px] font-bold text-primary-green-600 hover:text-primary-green-700 uppercase tracking-wider px-2 py-1 bg-primary-green-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Manage
                                                            </A>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Hierarchy Plane */}
                                    <Card class="p-6">
                                        <div class="flex items-start justify-between mb-8">
                                            <div>
                                                <h2 class="text-base font-bold text-slate-900">Hierarchy Positioning</h2>
                                                <p class="text-xs text-slate-500 mt-1">Relocate this category within the building blocks.</p>
                                            </div>
                                            <div class="px-3 py-1 bg-amber-50 border border-amber-100 rounded text-[10px] font-bold text-amber-700">
                                                LEVEL {data().depth + 1} / 3
                                            </div>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                            <div class="space-y-4 p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Location</p>
                                                <div class="flex items-center gap-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                                    <span class="text-slate-400">Categories</span>
                                                    <FolderIcon class="w-3 h-3 text-slate-300 flex-shrink-0" />
                                                    <Show when={data().parentName}>
                                                        <span class="text-slate-400">{data().parentName}</span>
                                                        <FolderIcon class="w-3 h-3 text-slate-300 flex-shrink-0" />
                                                    </Show>
                                                    <span class="font-bold text-slate-900">{data().name}</span>
                                                </div>
                                            </div>

                                            <div class="space-y-3">
                                                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Change Parent Category</label>
                                                <select
                                                    class="w-full h-11 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 transition-all"
                                                    value={editParentId() || ""}
                                                    onChange={(e) => setEditParentId(e.currentTarget.value || null)}
                                                >
                                                    <option value="">Root Category (None)</option>
                                                    <For each={data().parentOptions}>
                                                        {(opt) => (
                                                            <option value={opt.id} selected={opt.id === data().parentId}>
                                                                {opt.name}
                                                            </option>
                                                        )}
                                                    </For>
                                                </select>
                                                <p class="text-[10px] text-slate-400">Only categories with depth &lt; 2 can be parents.</p>
                                            </div>
                                        </div>
                                    </Card>

                                </div>
                            </div>
                        </>
                    )}
                </Show>
            </Suspense>
        </div>
    );
}
