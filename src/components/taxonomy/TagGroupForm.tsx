import { For, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { TagBadge } from "./TagBadge";
import { createTagGroup } from "~/lib/api/taxonomy";

interface TagGroupFormProps {
    initialValues?: {
        name: string;
        description: string;
        isActive: boolean;
        tags: string[];
    };
    isEdit?: boolean;
}

export function TagGroupForm(props: TagGroupFormProps) {
    const navigate = useNavigate();
    const [name, setName] = createSignal(props.initialValues?.name || "");
    const [description, setDescription] = createSignal(props.initialValues?.description || "");
    const [isActive, setIsActive] = createSignal(props.initialValues?.isActive !== false);

    const [tags, setTags] = createSignal<string[]>(props.initialValues?.tags || []);
    const [tagInput, setTagInput] = createSignal("");

    const handleAddTag = () => {
        if (tagInput().trim() !== '' && !tags().includes(tagInput().trim())) {
            setTags([...tags(), tagInput().trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags().filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!name().trim()) return;

        await createTagGroup({
            name: name().trim(),
            description: description().trim(),
            isActive: isActive()
        });

        // Note: Batch tag creation not currently supported in the base create action
        // Usually, the user adds tags later in the detail page.
        navigate("/tags");
    };

    return (
        <div class="space-y-6">
            <Card class="p-6">
                <h2 class="text-xl font-semibold text-slate-800 mb-6">Group Settings</h2>

                <div class="space-y-5">
                    <div>
                        <Input
                            label="Group Name *"
                            placeholder="e.g. Light Requirements"
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                        />
                        <p class="text-xs text-slate-500 mt-1.5">
                            This name will be displayed in the product filters.
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 transition-shadow m-0"
                            placeholder="Briefly describe what attributes this group holds..."
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                        />
                    </div>

                    <div class="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                        <div>
                            <p class="text-sm font-medium text-slate-900">Active Status</p>
                            <p class="text-xs text-slate-500 mt-0.5">Toggle whether this group is visible globally.</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" checked={isActive()} onChange={(e) => setIsActive(e.currentTarget.checked)} />
                            <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green-600"></div>
                        </label>
                    </div>
                </div>
            </Card>

            <Card class="p-6">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-semibold text-slate-800">Attributes inside this Group</h2>
                        <p class="text-sm text-slate-500 mt-1">
                            Add the specific tags that belong to this classification.
                        </p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                        {tags().length} Tags
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
                        {tags().length === 0 ? (
                            <div class="flex flex-col items-center justify-center h-full text-slate-400 py-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2 opacity-50">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                </svg>
                                <p class="text-sm">No tags added yet.</p>
                            </div>
                        ) : (
                            <div class="flex flex-wrap gap-2">
                                <For each={tags()}>
                                    {(tag) => (
                                        <div class="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full bg-white border border-slate-200 shadow-sm group">
                                            <span class="text-sm font-medium text-slate-700">{tag}</span>
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                class="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </For>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <div class="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="md" onClick={() => navigate("/tags")}>
                    Cancel
                </Button>
                <Button variant="primary" size="md" onClick={handleSubmit}>
                    {props.isEdit ? "Save Changes" : "Create Tag Group"}
                </Button>
            </div>
        </div>
    );
}
