import { createSignal, For, Show } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";

// Using dummy data as per design-first requirement
const DUMMY_GROUP_DATA = {
    id: "uuid-1",
    name: "Light Requirements",
    description: "Amount of sunlight a plant needs to thrive indoors or outdoors.",
    isActive: true,
    tags: [
        { id: "1", name: "Full Sun", usageCount: 120, isActive: true },
        { id: "2", name: "Partial Shade", usageCount: 85, isActive: true },
        { id: "3", name: "Low Light", usageCount: 40, isActive: false },
        { id: "4", name: "Bright Indirect", usageCount: 155, isActive: true },
    ],
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
    const [group, setGroup] = createSignal(DUMMY_GROUP_DATA);
    const [newTagName, setNewTagName] = createSignal("");

    const toggleTagStatus = (tagId: string) => {
        setGroup({
            ...group(),
            tags: group().tags.map(t => t.id === tagId ? { ...t, isActive: !t.isActive } : t)
        });
    };

    const handleAddTag = () => {
        if (!newTagName().trim()) return;
        const newTag = {
            id: Math.random().toString(36).substr(2, 9),
            name: newTagName().trim(),
            usageCount: 0,
            isActive: true
        };
        setGroup({
            ...group(),
            tags: [...group().tags, newTag]
        });
        setNewTagName("");
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">
            <nav class="flex mb-4 text-sm font-medium text-slate-500">
                <A href="/tags" class="hover:text-primary-green-700 transition-colors">Tags</A>
                <span class="mx-2 text-slate-300">/</span>
                <span class="text-slate-900 font-semibold">{group().name}</span>
            </nav>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-bold text-slate-900">{group().name}</h1>
                        <span class={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${group().isActive ? 'bg-primary-green-50 text-primary-green-700 border border-primary-green-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {group().isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <p class="text-sm text-slate-500 mt-1">Management hub for grouping and attribute settings.</p>
                </div>
                <div class="flex gap-3">
                    <Button variant="outline" class="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                        Delete Group
                    </Button>
                    <Button variant="primary">
                        Save Changes
                    </Button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Column 1: Settings */}
                <div class="lg:col-span-1 space-y-6">
                    <Card class="p-6">
                        <h2 class="text-lg font-semibold text-slate-900 mb-6">Group Settings</h2>
                        <div class="space-y-5">
                            <Input
                                label="Group Name"
                                value={group().name}
                                onInput={(e) => setGroup({ ...group(), name: e.currentTarget.value })}
                            />
                            <div class="space-y-2">
                                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Description</label>
                                <textarea
                                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 transition-all min-h-[100px]"
                                    value={group().description}
                                    onInput={(e) => setGroup({ ...group(), description: e.currentTarget.value })}
                                />
                            </div>
                            <div class="pt-2 border-t border-slate-100">
                                <StatusToggle
                                    checked={group().isActive}
                                    onChange={(checked) => setGroup({ ...group(), isActive: checked })}
                                    label="Visible in Catalog"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 3. Column 2/3: Tags Management */}
                <div class="lg:col-span-2 space-y-6">
                    <Card class="p-0 overflow-hidden">
                        <div class="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
                            <div>
                                <h2 class="text-lg font-semibold text-slate-900">Tags Management</h2>
                                <p class="text-sm text-slate-500 mt-0.5">Control individual attribute visibility and status.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    {group().tags.length} TOTAL TAGS
                                </span>
                            </div>
                        </div>

                        {/* Inline Add */}
                        <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex gap-3 items-end">
                            <div class="flex-1">
                                <Input
                                    label="Quick Add Tag"
                                    placeholder="e.g. Medium Light"
                                    value={newTagName()}
                                    onInput={(e) => setNewTagName(e.currentTarget.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                />
                            </div>
                            <Button variant="secondary" size="md" onClick={handleAddTag} disabled={!newTagName().trim()}>
                                Add
                            </Button>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50/80 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200">
                                        <th class="px-6 py-4">Tag Name</th>
                                        <th class="px-6 py-4">Products</th>
                                        <th class="px-6 py-4">Status</th>
                                        <th class="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <For each={group().tags}>
                                        {(tag) => (
                                            <tr class="hover:bg-slate-50/50 transition-colors group">
                                                <td class="px-6 py-4">
                                                    <span class="text-sm font-semibold text-slate-700">{tag.name}</span>
                                                </td>
                                                <td class="px-6 py-4">
                                                    <span class="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{tag.usageCount} products</span>
                                                </td>
                                                <td class="px-6 py-4">
                                                    <StatusToggle
                                                        checked={tag.isActive}
                                                        onChange={() => toggleTagStatus(tag.id)}
                                                    />
                                                </td>
                                                <td class="px-6 py-4 text-right">
                                                    <button class="text-slate-400 hover:text-red-600 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                            <path d="M3 6h18"></path>
                                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </For>
                                </tbody>
                            </table>
                            <Show when={group().tags.length === 0}>
                                <div class="px-6 py-12 text-center text-slate-400">
                                    <p class="text-sm italic">No tags associated with this group yet.</p>
                                </div>
                            </Show>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
