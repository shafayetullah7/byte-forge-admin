import { createSignal, createEffect, onCleanup, For, Suspense } from "solid-js";
import { useNavigate, createAsync, type RouteDefinition } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { TagGroupCard } from "~/components/taxonomy/TagGroupCard";
import { getTagGroups } from "~/lib/api/endpoints/tag-groups";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export const route: RouteDefinition = {
    preload: () => getTagGroups(),
};

export default function TagsPageIndex() {
    const navigate = useNavigate();

    // Search and filter state
    const [searchQuery, setSearchQuery] = createSignal("");
    const [debouncedSearch, setDebouncedSearch] = createSignal("");
    const [activeFilter, setActiveFilter] = createSignal<'all' | 'active' | 'empty'>('all');
    let searchTimeout: any;

    const handleSearchInput = (e: Event) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        setSearchQuery(val);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            setDebouncedSearch(val);
        }, 300);
    };

    onCleanup(() => clearTimeout(searchTimeout));

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
            return groups.filter((g: any) => (g.tagCount || 0) === 0);
        }
        return groups;
    };

    const metrics = () => {
        const data = tagGroups();
        if (!data) return [];
        const totalGroups = data.length;
        const totalTags = data.reduce((acc: number, g: any) => acc + (g.tagCount || 0), 0);

        return [
            { label: "Total Tag Groups", value: totalGroups.toString(), subValue: "Live from backend" },
            { label: "Total Active Tags", value: totalTags.toString(), subValue: "Aggregated" },
            { label: "Empty Groups", value: data.filter((g: any) => (g.tagCount || 0) === 0).length.toString(), subValue: "Needs attention" },
        ];
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">

            {/* 1. Header Section */}
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Tag & Attribute Library</h1>
                    <p class="text-sm text-slate-500 mt-1">
                        Define product traits, light requirements, and categorization metadata.
                    </p>
                </div>
                <div class="flex gap-3">
                    <Button variant="primary" size="md" onClick={() => navigate("/tags/groups/create")}>
                        Create Tag Group
                    </Button>
                </div>
            </div>

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

            {/* 3. Filter & Search Toolbar */}
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
                        onInput={handleSearchInput}
                    />
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <button
                        class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter() === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Groups
                    </button>
                    <button
                        class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter() === 'active' ? 'bg-primary-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        onClick={() => setActiveFilter('active')}
                    >
                        Active Only
                    </button>
                    <button
                        class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter() === 'empty' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-amber-100/50 hover:text-amber-700'}`}
                        onClick={() => setActiveFilter('empty')}
                    >
                        Empty Groups
                    </button>
                </div>
            </div>

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
                                <Button variant="outline" onClick={() => { setSearchQuery(""); setDebouncedSearch(""); setActiveFilter('all'); }}>Clear Filters</Button>
                            </div>
                        }>
                            {(group: any) => (
                                <TagGroupCard
                                    id={group.id}
                                    name={group.name}
                                    description={group.description}
                                    tags={group.tags || []}
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
