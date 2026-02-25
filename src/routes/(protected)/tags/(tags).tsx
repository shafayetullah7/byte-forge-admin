import { useNavigate, createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Suspense } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { TagGroupCard } from "~/components/taxonomy/TagGroupCard";
import { CreateTagGroupCard } from "~/components/taxonomy/CreateTagGroupCard";
import { getTagGroups } from "~/lib/api/taxonomy";

export const route: RouteDefinition = {
    preload: () => getTagGroups(),
};



export default function TagsPageIndex() {
    const navigate = useNavigate();
    const tagGroups = createAsync(() => getTagGroups());

    const metrics = () => {
        const data = tagGroups();
        if (!data) return [];

        const totalGroups = data.length;
        const totalTags = data.reduce((acc: number, g: any) => acc + (g.tagCount || 0), 0);

        return [
            { label: "Total Tag Groups", value: totalGroups.toString(), subValue: "Live from backend" },
            { label: "Total Active Tags", value: totalTags.toString(), subValue: "Aggregated" },
            { label: "Most Used Group", value: "Dynamic", subValue: "Calculating..." },
            { label: "Empty Groups", value: data.filter((g: any) => (g.tagCount || 0) === 0).length.toString(), subValue: "Needs attention" },
        ];
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">

            {/* 1. Header Section */}
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Tag & Attribute Library</h1>
                    <p class="text-sm text-slate-500 mt-1">
                        Define product traits, light requirements, and categorization metadata.
                    </p>
                </div>
                <div class="flex gap-3">
                    <Button variant="outline" size="md">
                        Import
                    </Button>
                    <Button variant="primary" size="md" onClick={() => navigate("/tags/groups/create")}>
                        Create Tag Group
                    </Button>
                </div>
            </div>

            {/* 2. Metrics Block */}
            <Suspense fallback={<div class="h-32 bg-slate-50 rounded-2xl animate-pulse mb-8" />}>
                <TagMetricsPanel metrics={metrics()} />
            </Suspense>

            {/* 3. Toolbar (Search & Filters) */}
            <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div class="relative w-full sm:max-w-[400px]">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <Input
                        label="Search"
                        placeholder="Search tag groups or attributes..."
                        class="pl-10 w-full"
                    />
                </div>

                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <select class="h-11 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 w-full sm:w-auto">
                        <option>Sort by Name</option>
                        <option>Sort by Usage Count</option>
                        <option>Sort by Recent</option>
                    </select>
                </div>
            </div>

            {/* 4. Tag Groups Grid */}
            <Suspense fallback={<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(() => <div class="h-64 bg-slate-100 rounded-2xl border border-slate-200" />)}
            </div>}>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CreateTagGroupCard />
                    <For each={tagGroups()}>
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

        </div>
    );
}
