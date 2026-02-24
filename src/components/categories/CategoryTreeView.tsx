import { For } from "solid-js";
import { CategoryTreeItem, CategoryNode } from "./CategoryTreeItem";

interface CategoryTreeViewProps {
    categories: CategoryNode[];
}

export function CategoryTreeView(props: CategoryTreeViewProps) {
    return (
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-slate-100 bg-slate-50/30">
                <div class="flex items-center justify-between">
                    <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Hierarchy Explorer</h2>
                    <span class="text-xs font-medium text-slate-400">MAX 3 LEVELS</span>
                </div>
            </div>
            <div class="p-3">
                <For each={props.categories}>
                    {(category) => (
                        <CategoryTreeItem category={category} level={0} />
                    )}
                </For>

                {props.categories.length === 0 && (
                    <div class="py-12 text-center">
                        <p class="text-sm text-slate-400 italic">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
