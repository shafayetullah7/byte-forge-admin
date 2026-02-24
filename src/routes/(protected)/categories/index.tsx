import { useNavigate, A } from "@solidjs/router";
import { For } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { CategoryTreeView } from "~/components/categories/CategoryTreeView";

const DUMMY_METRICS = [
    { label: "Total Categories", value: "34", subValue: "Root + Nested" },
    { label: "Taxonomy Depth", value: "3 Levels", subValue: "Maximum allowed" },
    { label: "Active Nodes", value: "28", subValue: "Serving catalog" },
    { label: "System Health", value: "Optimal", subValue: "Closure table synced" },
];

const DUMMY_TREE_DATA = [
    {
        id: "1",
        name: "Home & Garden",
        slug: "home-garden",
        depth: 0,
        isActive: true,
        children: [
            {
                id: "2",
                name: "Furniture",
                slug: "furniture",
                depth: 1,
                isActive: true,
                children: [
                    { id: "3", name: "Laptops", slug: "laptops", depth: 2, isActive: true },
                    { id: "4", name: "Office Chairs", slug: "office-chairs", depth: 2, isActive: true },
                ]
            },
            { id: "5", name: "Kitchen", slug: "kitchen", depth: 1, isActive: true }
        ]
    },
    {
        id: "6",
        name: "Electronics",
        slug: "electronics",
        depth: 0,
        isActive: true,
        children: []
    }
];

export default function CategoriesPageIndex() {
    const navigate = useNavigate();

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">

            {/* Page Header */}
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Category Management</h1>
                    <p class="text-sm text-slate-500 mt-1">
                        Organize the product catalog and define global navigation structures.
                    </p>
                </div>
                <div class="flex gap-3">
                    <Button variant="outline" size="md">
                        Import/Export
                    </Button>
                    <A href="/categories/create">
                        <Button variant="primary" size="md">
                            Add Root Category
                        </Button>
                    </A>
                </div>
            </div>

            {/* Stats Overview */}
            <TagMetricsPanel metrics={DUMMY_METRICS} />

            {/* Toolbar */}
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
                        placeholder="Search categories (ROOT, Leaf, or Sub)..."
                        class="pl-10 w-full"
                    />
                </div>
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <select class="h-11 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 w-full sm:w-auto">
                        <option>Expand All</option>
                        <option>Collapse All</option>
                        <option>Show Active Only</option>
                    </select>
                </div>
            </div>

            {/* Tree Structure */}
            <CategoryTreeView categories={DUMMY_TREE_DATA} />

        </div>
    );
}
