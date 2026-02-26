import { createSignal, createEffect } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { slugify } from "~/lib/utils/slugify";
import type { Tag, UpdateTagDto } from "~/lib/api/types";

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
    const [isEditing, setIsEditing] = createSignal(false);

    // Edit state
    const [editName, setEditName] = createSignal("");
    const [editSlug, setEditSlug] = createSignal("");
    const [isEditSlugManual, setIsEditSlugManual] = createSignal(false);
    const [editDesc, setEditDesc] = createSignal("");
    const [isSaving, setIsSaving] = createSignal(false);

    // Sync slug in real-time
    createEffect(() => {
        const name = editName();
        if (isEditing() && !isEditSlugManual() && name) {
            setEditSlug(slugify(name));
        }
    });

    const startEdit = () => {
        setEditName(props.tag.name);
        setEditSlug(props.tag.slug);
        setEditDesc(props.tag.description || "");
        setIsEditSlugManual(true); // Don't auto-overwrite existing slug initially
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!editName().trim() || !editSlug().trim()) return;
        setIsSaving(true);
        try {
            await props.onUpdate(props.tag.id, {
                name: editName().trim(),
                slug: editSlug().trim(),
                description: editDesc().trim() || undefined
            });
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleStatus = () => {
        props.onUpdate(props.tag.id, { isActive: !props.tag.isActive });
    };

    if (isEditing()) {
        return (
            <div class="p-4 rounded-xl border border-primary-green-200 bg-primary-green-50/30 animate-in fade-in zoom-in-95 duration-200 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <Input
                        label="Tag Name *"
                        value={editName()}
                        onInput={(e) => setEditName(e.currentTarget.value)}
                        placeholder="e.g. Low Light"
                    />
                    <Input
                        label="Slug *"
                        value={editSlug()}
                        onInput={(e) => {
                            setEditSlug(e.currentTarget.value);
                            setIsEditSlugManual(true);
                        }}
                        placeholder="e.g. low-light"
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 text-[10px] mb-1">Description (Optional)</label>
                    <textarea
                        class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 transition-all min-h-[60px]"
                        value={editDesc()}
                        onInput={(e) => setEditDesc(e.currentTarget.value)}
                        placeholder="Optional description..."
                    />
                </div>
                <div class="flex justify-end gap-2 border-t border-primary-green-100 pt-3">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving()}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving()}>Save Tag</Button>
                </div>
            </div>
        );
    }

    return (
        <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all group shadow-sm hover:shadow-md">
            <div class="flex items-center gap-4">
                <StatusToggle checked={props.tag.isActive} onChange={toggleStatus} />
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-900">{props.tag.name}</span>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{props.tag.slug}</span>
                        <span class="text-[10px] text-slate-400">&bull;</span>
                        <span class="text-[10px] text-slate-500">{props.tag.usageCount} uses</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                    onClick={() => props.onDelete(props.tag.id)}
                    title="Delete Tag"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
