import { createSignal, For, Suspense, createDeferred } from "solid-js";
import { useNavigate, createAsync, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { TagGroupCard } from "~/components/taxonomy/TagGroupCard";
import { getTagGroups } from "~/lib/api/endpoints/tag-groups";
import type { TagGroup } from "~/lib/api/endpoints/tag-groups/tag-groups.types";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { PageHeader } from "~/components/layout/PageHeader";

export const route: RouteDefinition = {
    preload: () => getTagGroups(),
};

export default function TagsPageIndex() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = createSignal("");
    const debouncedSearch = createDeferred(searchQuery, { timeoutMs: 300 });
    const [activeFilter, setActiveFilter] = createSignal<'all' | 'active' | 'empty'>('all');

    const tagGroups = createAsync(() => getTagGroups({
        search: debouncedSearch() || undefined,
        isActive: activeFilter() === 'active' ? 'true' : undefined,
        limit: 100
    }));

    const filteredGroups = () => {
        const groups = tagGroups();
        if (!groups) return [];
        if (activeFilter() === 'empty') {
            return groups.filter((g) => (g.tagCount || 0) === 0);
        }
        return groups;
    };

    const metrics = () => {
        const data = tagGroups();
        if (!data) return [];
        const totalGroups = data.length;
        const totalTags = data.reduce((acc: number, g) => acc + (g.tagCount || 0), 0);

        return [
            { label: "Total Tag Groups", value: totalGroups.toString(), subValue: "Live from backend" },
            { label: "Total Active Tags", value: totalTags.toString(), subValue: "Aggregated" },
            { label: "Empty Groups", value: data.filter((g) => (g.tagCount || 0) === 0).length.toString(), subValue: "Needs attention" },
        ];
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">

            <PageHeader
                title="Tag & Attribute Library"
                description="Define product traits, light requirements, and categorization metadata."
            >
                <Button variant="primary" size="md" onClick={() => navigate("/tags/groups/create")}>
                    Create Tag Group
                </Button>
            </PageHeader>

            <div class="mb-8 hidden sm:block">
                <SafeErrorBoundary
                    fallback={(err, reset) => (
                        <InlineErrorFallback error={err} reset={reset} label="tag metrics" />
                    )}
                >
                    <Suspense fallback={<div class="h-32 bg-slate-50 rounded-2xl animate-pulse" />}>
                        <TagMetricsPanel metrics={metrics()} />
                    </Suspense>
                </SafeErrorBoundary>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div class="relative w-full sm:max-w-[400px] flex-1">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <input
                        type="text"
                        class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 outline-none transition-shadow"
                        placeholder="Search tag groups by name..."
                        value={searchQuery()}
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    />
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <button
                        type="button"
                        class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter() === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Groups
                    </button>
                    <button
                        type="button"
                        class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter() === 'active' ? 'bg-primary-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setActiveFilter('active')}
                    >
                        Active Only
                    </button>
                    <button
                        type="button"
                        class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter() === 'empty' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-amber-100/50 hover:text-amber-700'}`}
                        onClick={() => setActiveFilter('empty')}
                    >
                        Empty Groups
                    </button>
                </div>
            </div>

            <SafeErrorBoundary
                fallback={(err, reset) => (
                    <InlineErrorFallback error={err} reset={reset} label="tag groups" />
                )}
            >
                <Suspense fallback={
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(() => <div class="h-64 bg-slate-100 rounded-2xl border border-slate-200" />)}
                    </div>
                }>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <For each={filteredGroups()} fallback={
                            <div class="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center">
                                <h3 class="text-sm font-bold text-slate-400 mb-1">No tag groups found</h3>
                                <p class="text-xs text-slate-400 mb-4">Try changing your search or filter criteria.</p>
                                <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveFilter('all'); }}>Clear Filters</Button>
                            </div>
                        }>
                            {(group: TagGroup) => (
                                <TagGroupCard
                                    id={group.id}
                                    name={group.name ?? ""}
                                    tags={group.tags || []}
                                    isActive={group.isActive}
                                    tagCount={group.tagCount}
                                    onEdit={(id) => navigate(`/tags/groups/${id}`)}
                                />
                            )}
                        </For>
                    </div>
                </Suspense>
            </SafeErrorBoundary>

        </div>
    );
}
