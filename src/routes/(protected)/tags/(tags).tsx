import { createSignal, For, Suspense } from "solid-js";
import { useNavigate, createAsync, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { TagGroupCard } from "~/components/taxonomy/TagGroupCard";
import { getTagGroups } from "~/lib/api/endpoints/tag-groups";
import type { TagGroup } from "~/lib/api/endpoints/tag-groups/tag-groups.types";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { PageHeader } from "~/components/layout/PageHeader";
import { FilterToolbar } from "~/components/layout/FilterToolbar";
import { useDebouncedSignal } from "~/lib/hooks/useDebouncedSignal";

export const route: RouteDefinition = {
    preload: () => getTagGroups(),
};

export default function TagsPageIndex() {
    const navigate = useNavigate();

    // Search and filter state
    const [searchQuery, setSearchQuery] = createSignal("");
    const debouncedSearch = useDebouncedSignal(searchQuery);
    const [activeFilter, setActiveFilter] = createSignal<'all' | 'active' | 'empty'>('all');

    // Backend-driven data fetching based on search/active state
    const tagGroups = createAsync(() => getTagGroups({
        search: debouncedSearch() || undefined,
        isActive: activeFilter() === 'active' ? 'true' : undefined,
        limit: 100 // Load up to 100 for a reasonable UI experience before we add infinite scroll
    }));

    // Local filtering for 'empty' since backend doesn't explicitly filter by tagCount=0
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
                actions={
                    <Button variant="primary" size="md" onClick={() => navigate("/tags/groups/create")}>
                        Create Tag Group
                    </Button>
                }
            />

            {/* 2. Metrics Block */}
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

            <FilterToolbar
                searchValue={searchQuery()}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search tag groups by name..."
            >
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
            </FilterToolbar>

            {/* 4. Tag Groups Grid */}
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
