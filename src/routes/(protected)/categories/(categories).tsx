import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Suspense, createSignal, createMemo } from "solid-js";
import { Button } from "~/components/ui/Button";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { CategoryTreeView } from "~/components/categories/CategoryTreeView";
import { getCategoryTree } from "~/lib/api/endpoints/categories";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { CategoryNode } from "~/lib/api/endpoints/categories/categories.types";
import { PageHeader } from "~/components/layout/PageHeader";
import { FilterToolbar } from "~/components/layout/FilterToolbar";

export const route: RouteDefinition = {
    preload: () => getCategoryTree(),
};

export default function CategoriesPageIndex() {
    const categories = createAsync(() => getCategoryTree());
    const [searchTerm, setSearchTerm] = createSignal("");
    const [filterActive, setFilterActive] = createSignal(false);

    const filteredCategories = createMemo(() => {
        const data = categories();
        if (!data) return [];

        const search = searchTerm().toLowerCase().trim();
        const onlyActive = filterActive();

        if (!search && !onlyActive) return data;

        const filterNodes = (nodes: CategoryNode[]): CategoryNode[] => {
            return nodes
                .map(node => {
                    const children = node.children ? filterNodes(node.children) : [];
                    const matchesSearch = !search ||
                        node.name.toLowerCase().includes(search) ||
                        node.slug.toLowerCase().includes(search);
                    const matchesActive = !onlyActive || node.isActive;

                    if (matchesSearch && matchesActive) {
                        return { ...node, children };
                    }

                    if (children.length > 0) {
                        return { ...node, children };
                    }

                    return null;
                })
                .filter((n): n is CategoryNode => n !== null);
        };

        return filterNodes(data);
    });

    const metrics = () => {
        const data = categories();
        if (!data) return [];

        const countNodes = (nodes: any[]): number => {
            return nodes.reduce((acc, node) => acc + 1 + countNodes(node.children || []), 0);
        };

        const countActiveNodes = (nodes: any[]): number => {
            return nodes.reduce((acc, node) => acc + (node.isActive ? 1 : 0) + countActiveNodes(node.children || []), 0);
        };

        return [
            { label: "Total Categories", value: countNodes(data).toString(), subValue: "Live from backend" },
            { label: "Taxonomy Depth", value: "3 Levels", subValue: "Maximum allowed" },
            { label: "Active Nodes", value: countActiveNodes(data).toString(), subValue: "Serving catalog" },
            { label: "System Health", value: "Optimal", subValue: "Closure table synced" },
        ];
    };

    return (
        <div class="px-6 py-8 mx-auto max-w-[1400px]">

            <PageHeader
                title="Category Management"
                description="Organize the product catalog and define global navigation structures."
                actions={
                    <>
                        <Button variant="outline" size="md">
                            Import/Export
                        </Button>
                        <A href="/categories/create">
                            <Button variant="primary" size="md">
                                Add Root Category
                            </Button>
                        </A>
                    </>
                }
            />

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

            <FilterToolbar
                searchValue={searchTerm()}
                onSearchChange={setSearchTerm}
                searchLabel="Search"
                searchPlaceholder="Search categories (ROOT, Leaf, or Sub)..."
            >
                <select
                    class="h-11 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 w-full sm:w-auto"
                    onChange={(e) => {
                        if (e.currentTarget.value === "Show Active Only") setFilterActive(true);
                        else if (e.currentTarget.value === "Show All") setFilterActive(false);
                    }}
                >
                    <option>Show All</option>
                    <option>Show Active Only</option>
                </select>
            </FilterToolbar>

            {/* Tree Structure — isolated boundary */}
            <SafeErrorBoundary
                fallback={(err, reset) => (
                    <InlineErrorFallback error={err} reset={reset} label="category tree" />
                )}
            >
                <Suspense fallback={<div class="h-64 bg-slate-50 rounded-2xl animate-pulse" />}>
                    <CategoryTreeView categories={filteredCategories() || []} />
                </Suspense>
            </SafeErrorBoundary>

        </div>
    );
}
