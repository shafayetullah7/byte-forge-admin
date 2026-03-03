import { Card } from "../ui/Card";
import { TagBadge } from "./TagBadge";
import type { Tag } from "~/lib/api/endpoints/tags";

interface TagGroupProps {
    id: string;
    name: string;
    description?: string;
    tags: Tag[];
    isActive: boolean;
    tagCount?: number;
    onEdit?: (id: string) => void;
}

export function TagGroupCard(props: TagGroupProps) {
    return (
        <Card class="p-6 flex flex-col h-full hover:shadow-md transition-shadow group">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <h3 class="text-base font-semibold text-slate-900">{props.name}</h3>
                        {!props.isActive && (
                            <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                Inactive
                            </span>
                        )}
                    </div>
                    <p class="text-sm text-slate-500 mt-1 line-clamp-2">
                        {props.description || "No description provided."}
                    </p>
                </div>
                <button
                    onClick={() => props.onEdit?.(props.id)}
                    class="text-slate-400 hover:text-primary-green-700 transition-colors opacity-0 group-hover:opacity-100 p-1 ml-4 shrink-0"
                    title="Edit Tag Group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                </button>
            </div>

            <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
                {props.tags.slice(0, 10).map((tag) => (
                    <TagBadge text={tag.name || tag.slug} count={tag.usageCount} />
                ))}

                {/* 
                  Since the API embed up to 3 tags, but total tagCount is provided,
                  we show "+X more" if there are more tags in the DB.
                */}
                {props.tagCount !== undefined && props.tagCount > props.tags.length && (
                    <div class="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                        +{props.tagCount - props.tags.length} more
                    </div>
                )}
                {props.tagCount === undefined && props.tags.length > 10 && (
                    <div class="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                        +{props.tags.length - 10} more
                    </div>
                )}

                {props.tags.length === 0 && (
                    <span class="text-sm text-slate-400 italic">No tags associated</span>
                )}
            </div>
        </Card>
    );
}
