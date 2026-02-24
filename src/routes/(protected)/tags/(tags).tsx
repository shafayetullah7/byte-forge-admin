import { useNavigate } from "@solidjs/router";
import { For } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { TagGroupCard } from "~/components/taxonomy/TagGroupCard";
import { CreateTagGroupCard } from "~/components/taxonomy/CreateTagGroupCard";

const DUMMY_METRICS = [
    { label: "Total Tag Groups", value: "12", subValue: "+2 this month" },
    { label: "Total Active Tags", value: "148", subValue: "+15 this month" },
    { label: "Most Used Group", value: "Light Requirements", subValue: "450 products attached" },
    { label: "Empty Groups", value: "1", subValue: "Needs review" },
];

const DUMMY_GROUPS = [
    {
        id: "uuid-1",
        name: "Light Requirements",
        description: "Amount of sunlight a plant needs to thrive indoors or outdoors.",
        tags: [
            { id: "1", name: "Full Sun", usageCount: 120, isActive: true },
            { id: "2", name: "Partial Shade", usageCount: 85, isActive: true },
            { id: "3", name: "Low Light", usageCount: 40, isActive: true },
            { id: "4", name: "Bright Indirect", usageCount: 155, isActive: true },
        ],
    },
    {
        id: "uuid-2",
        name: "Watering Frequency",
        description: "Guidelines for how often a plant should be watered.",
        tags: [
            { id: "5", name: "Daily", usageCount: 12, isActive: true },
            { id: "6", name: "Weekly", usageCount: 205, isActive: true },
            { id: "7", name: "Bi-weekly", usageCount: 95, isActive: true },
            { id: "8", name: "Monthly", usageCount: 45, isActive: true },
        ],
    },
];

export default function TagsPageIndex() {
    const navigate = useNavigate();

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
            <TagMetricsPanel metrics={DUMMY_METRICS} />

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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CreateTagGroupCard />
                <For each={DUMMY_GROUPS}>
                    {(group) => (
                        <TagGroupCard
                            id={group.id}
                            name={group.name}
                            description={group.description}
                            tags={group.tags}
                            onEdit={(id) => navigate(`/tags/groups/${id}`)}
                        />
                    )}
                </For>
            </div>

        </div>
    );
}
