import { createMemo } from "solid-js";
import { CategoryNode } from "../../lib/api/endpoints/categories/categories.types";
import { AdvancedSelect } from "../ui/AdvancedSelect";
import { FolderIcon } from "../icons";

interface CategorySelectorProps {
    categories: CategoryNode[];
    value: string | null;
    onChange: (value: string | null) => void;
    disabledId?: string; // Prevent selecting self or descendants
    label?: string;
    error?: string;
}

interface FlattenedCategory {
    id: string;
    name: string;
    level: number;
    depth: number;
    isDisabled: boolean;
}

export function CategorySelector(props: CategorySelectorProps) {
    const flattenCategories = (nodes: CategoryNode[], level = 0): FlattenedCategory[] => {
        let result: FlattenedCategory[] = [];
        for (const node of nodes) {
            // A category is disabled for selection if:
            // 1. It's the current category being edited (disabledId)
            // 2. Its level is >= 2 (max depth is 3, so we can't be a parent if we are already at level 2)
            const isDisabled = node.id === props.disabledId || level >= 2;

            result.push({
                id: node.id,
                name: node.name,
                level,
                depth: node.depth,
                isDisabled
            });

            if (node.children && node.children.length > 0) {
                result = [...result, ...flattenCategories(node.children, level + 1)];
            }
        }
        return result;
    };

    const options = createMemo(() => flattenCategories(props.categories));

    return (
        <AdvancedSelect<FlattenedCategory>
            label={props.label}
            options={options()}
            value={props.value}
            onChange={props.onChange}
            getLabel={(opt) => opt.name}
            getValue={(opt) => opt.id}
            error={props.error}
            placeholder="Search & select parent category"
            searchPlaceholder="Type category name..."
            emptyMessage="No categories available"
            allowClear
            renderOption={(opt) => (
                <div
                    class={`flex items-center gap-2 ${opt.isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                    style={{ "padding-left": `${opt.level * 12}px` }}
                >
                    <FolderIcon
                        class={`w-3.5 h-3.5 ${opt.level === 0 ? "text-primary-green-600" :
                                opt.level === 1 ? "text-amber-500" : "text-slate-400"
                            }`}
                    />
                    <span class={`truncate ${opt.isDisabled ? 'italic' : ''}`}>
                        {opt.name}
                    </span>
                    {opt.id === props.disabledId && (
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-auto">Current</span>
                    )}
                    {opt.level >= 2 && opt.id !== props.disabledId && (
                        <span class="text-[9px] font-bold text-red-400 uppercase tracking-tighter ml-auto">Max Depth</span>
                    )}
                </div>
            )}
            disabled={options().length === 0}
        />
    );
}
