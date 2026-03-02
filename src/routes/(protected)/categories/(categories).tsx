import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Suspense } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { CategoryTreeView } from "~/components/categories/CategoryTreeView";
import { getCategoryTree } from "~/lib/api/endpoints/categories";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";

export const route: RouteDefinition = {
    preload: () => getCategoryTree(),
};

export default function CategoriesPageIndex() {
    const categories = createAsync(() => getCategoryTree());

    const metrics = () => {
        const data = categories();
        if (!data) return [];

        const countNodes = (nodes: any[]): number => {
            return nodes.reduce((acc, node) => acc + 1 + countNodes(node.children || []), 0);
        };

        return [
            { label: "Total Categories", value: countNodes(data).toString(), subValue: "Live from backend" },
            { label: "Taxonomy Depth", value: "3 Levels", subValue: "Maximum allowed" },
            { label: "Active Nodes", value: "Syncing...", subValue: "Serving catalog" },
            { label: "System Health", value: "Optimal", subValue: "Closure table synced" },
        ];
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">

            {/* Page Header — outside boundary, state always preserved */}
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

            {/* Stats Overview — isolated boundary */}
            <div class="mb-8">
                <SafeErrorBoundary
                    fallback={(err, reset) => (
                        <InlineErrorFallback error={err} reset={reset} label="category metrics" />
                    )}
                >
                    <Suspense fallback={<div class="h-32 bg-slate-50 rounded-2xl animate-pulse" />}>
                        <TagMetricsPanel metrics={metrics()} />
                    </Suspense>
                </SafeErrorBoundary>
            </div>

            {/* Toolbar — outside boundary, state always preserved */}
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

            {/* Tree Structure — isolated boundary */}
            <SafeErrorBoundary
                fallback={(err, reset) => (
                    <InlineErrorFallback error={err} reset={reset} label="category tree" />
                )}
            >
                <Suspense fallback={<div class="h-64 bg-slate-50 rounded-2xl animate-pulse" />}>
                    <CategoryTreeView categories={categories() || []} />
                </Suspense>
            </SafeErrorBoundary>

        </div>
    );
}
