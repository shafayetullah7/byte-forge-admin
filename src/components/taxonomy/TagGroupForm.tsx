import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { createTagGroup, updateTagGroup, upsertTagGroupTranslation } from "~/lib/api/endpoints/tag-groups";
import type { TagGroup } from "~/lib/api/endpoints/tag-groups";
import { slugify } from "~/lib/utils/slugify";

// ─── Shared Styles/Components ────────────────────────────────────────────────

import type { SetStoreFunction } from "solid-js/store";

type BaseFormState = { name: string; description: string; isActive: boolean };

function BaseFormSections(props: {
    form: BaseFormState;
    setForm: SetStoreFunction<BaseFormState>;
    isEdit: boolean;
}) {
    return (
        <div class="space-y-5">
            <div>
                <Input
                    label="Group Name (English) *"
                    placeholder="e.g. Light Requirements"
                    value={props.form.name}
                    onInput={(e) => props.setForm("name", e.currentTarget.value)}
                    disabled={props.isEdit}
                />
                <p class="text-xs text-slate-500 mt-1.5">
                    {props.isEdit ? "Manage alternative names and descriptions below in translations." : "This will be the base English translation for the group."}
                </p>
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">
                    Description (English)
                </label>
                <textarea
                    rows={3}
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 transition-shadow m-0"
                    placeholder="Briefly describe what attributes this group holds..."
                    value={props.form.description}
                    onInput={(e) => props.setForm("description", e.currentTarget.value)}
                    disabled={props.isEdit}
                />
            </div>

            <div class="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                <div>
                    <p class="text-sm font-medium text-slate-900">Active Status</p>
                    <p class="text-xs text-slate-500 mt-0.5">Toggle whether this group is visible globally.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" checked={props.form.isActive} onChange={(e) => props.setForm("isActive", e.currentTarget.checked)} />
                    <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green-600"></div>
                </label>
            </div>
        </div>
    );
}

// ─── Create Form ──────────────────────────────────────────────────────────────

export function CreateTagGroupForm() {
    const navigate = useNavigate();

    const [form, setForm] = createStore({
        name: "",
        description: "",
        isActive: true,
        tags: [] as string[]
    });

    const [tagInput, setTagInput] = createSignal("");
    const [submitError, setSubmitError] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    const handleAddTag = () => {
        if (tagInput().trim() !== '' && !form.tags.includes(tagInput().trim())) {
            setForm("tags", [...form.tags, tagInput().trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setForm("tags", form.tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) return;

        setSubmitError("");
        setIsSubmitting(true);
        try {
            await createTagGroup({
                slug: slugify(form.name.trim()),
                isActive: form.isActive,
                translations: [{
                    locale: "en",
                    name: form.name.trim(),
                    description: form.description.trim() || undefined
                }],
                tags: form.tags.length > 0 ? form.tags.map(tag => ({
                    slug: slugify(tag),
                    isActive: true,
                    translations: [{
                        locale: "en",
                        name: tag
                    }]
                })) : undefined
            });

            navigate("/tags");
        } catch (err: any) {
            setSubmitError(err?.message || "Failed to create tag group. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div class="space-y-6">
            <Card class="p-6">
                <h2 class="text-xl font-semibold text-slate-800 mb-6">Create Group</h2>
                <BaseFormSections form={form} setForm={setForm} isEdit={false} />
            </Card>

            <Card class="p-6">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-semibold text-slate-800">Initial Tags</h2>
                        <p class="text-sm text-slate-500 mt-1">
                            Add some specific tags that belong to this classification now.
                        </p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                        {form.tags.length} Tags
                    </span>
                </div>

                <div class="space-y-4">
                    <div class="flex gap-2 items-center">
                        <div class="flex-1">
                            <Input
                                label="New Tag"
                                placeholder="Type a tag name (e.g. Full Sun) and press Enter"
                                value={tagInput()}
                                onInput={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                            />
                        </div>
                        <Button variant="secondary" onClick={handleAddTag} disabled={!tagInput().trim()}>
                            Add Tag
                        </Button>
                    </div>

                    <div class="p-4 rounded-lg border border-slate-200 bg-slate-50 min-h-[120px]">
                        {form.tags.length === 0 ? (
                            <div class="flex flex-col items-center justify-center h-full text-slate-400 py-6">
                                <p class="text-sm">No tags added yet.</p>
                            </div>
                        ) : (
                            <div class="flex flex-wrap gap-2">
                                <For each={form.tags}>
                                    {(tag) => (
                                        <div class="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full bg-white border border-slate-200 shadow-sm group">
                                            <span class="text-sm font-medium text-slate-700">{tag}</span>
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                class="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </For>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {submitError() && (
                <div class="p-3 mb-4 rounded-lg bg-red-100/50 border border-red-200 text-sm text-red-700">
                    {submitError()}
                </div>
            )}

            <div class="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="md" onClick={() => navigate("/tags")}>
                    Cancel
                </Button>
                <Button variant="primary" size="md" onClick={handleSubmit} isLoading={isSubmitting()}>
                    Create Tag Group
                </Button>
            </div>
        </div>
    );
}

// ─── Edit Form ────────────────────────────────────────────────────────────────

interface EditTagGroupFormProps {
    group: TagGroup;
}

export function EditTagGroupForm(props: EditTagGroupFormProps) {
    const navigate = useNavigate();

    // Store is initialized ONCE from props. No syncing effects.
    const [form, setForm] = createStore({
        name: props.group.name || "",
        description: "", // Edit view relies on TranslationManager for names
        isActive: props.group.isActive,
    });

    const [isSaving, setIsSaving] = createSignal(false);

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await updateTagGroup(props.group.id, {
                isActive: form.isActive,
            });
            navigate(`/tags/groups/${props.group.id}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div class="space-y-6">
            <Card class="p-6">
                <h2 class="text-xl font-semibold text-slate-800 mb-6">Group Settings</h2>
                <BaseFormSections form={form} setForm={setForm} isEdit={true} />
            </Card>

            <div class="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="md" onClick={() => navigate(`/tags/groups/${props.group.id}`)}>
                    Cancel
                </Button>
                <Button variant="primary" size="md" onClick={handleSubmit} disabled={isSaving()}>
                    {isSaving() ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}

