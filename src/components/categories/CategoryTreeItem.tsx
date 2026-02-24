import { createSignal, Show, For, Accessor } from "solid-js";
import { A } from "@solidjs/router";
import { ChevronRightIcon, ChevronDownIcon, FolderIcon } from "../icons";

export interface CategoryNode {
    id: string;
    name: string;
    slug: string;
    depth: number;
    isActive: boolean;
    children?: CategoryNode[];
}

interface CategoryTreeItemProps {
    category: CategoryNode;
    level: number;
}

export function CategoryTreeItem(props: CategoryTreeItemProps) {
    const [isOpen, setIsOpen] = createSignal(false);
    const hasChildren = () => props.category.children && props.category.children.length > 0;

    return (
        <div class="select-none">
            <div
                class={`group flex items-center py-2 px-3 rounded-lg transition-colors cursor-pointer ${props.level === 0 ? "hover:bg-slate-100" : "hover:bg-slate-50"
                    }`}
                onClick={() => setIsOpen(!isOpen())}
            >
                {/* Indentation */}
                <div style={{ width: `${props.level * 20}px` }} class="flex-shrink-0" />

                {/* Chevron */}
                <div class="w-6 h-6 flex items-center justify-center mr-1">
                    {hasChildren() ? (
                        <Show when={isOpen()} fallback={<ChevronRightIcon class="w-4 h-4 text-slate-400" />}>
                            <ChevronDownIcon class="w-4 h-4 text-slate-400" />
                        </Show>
                    ) : (
                        <div class="w-1.5 h-1.5 rounded-full bg-slate-200 ml-1.5" />
                    )}
                </div>

                {/* Icon & Name */}
                <div class="flex items-center flex-1 min-w-0">
                    <FolderIcon class={`w-4 h-4 mr-2 ${props.level === 0 ? "text-primary-green-600" : "text-slate-400"}`} />
                    <span class={`text-sm truncate ${props.level === 0 ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                        {props.category.name}
                    </span>
                    <span class="ml-2 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        /{props.category.slug}
                    </span>
                </div>

                {/* Actions */}
                <div class="flex items-center gap-3">
                    <A
                        href={`/categories/${props.category.id}`}
                        class="p-1 text-slate-400 hover:text-primary-green-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white rounded"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </A>
                </div>
            </div>

            {/* Children */}
            <Show when={isOpen() && hasChildren()}>
                <div class="mt-1">
                    <For each={props.category.children}>
                        {(child) => <CategoryTreeItem category={child} level={props.level + 1} />}
                    </For>
                </div>
            </Show>
        </div>
    );
}
