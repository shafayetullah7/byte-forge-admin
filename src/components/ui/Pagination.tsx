import { Button } from "./Button";
import type { PaginationMeta } from "~/lib/api/types";

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  limitOptions?: number[];
}

/**
 * Reusable pagination component for paginated lists
 * 
 * @example
 * ```tsx
 * <Pagination
 *   meta={shopsData()?.meta}
 *   onPageChange={(page) => setPage(page)}
 *   onLimitChange={(limit) => setLimit(limit)}
 *   showLimitSelector={true}
 * />
 * ```
 */
export function Pagination(props: PaginationProps) {
  const {
    meta,
    onPageChange,
    onLimitChange,
    showLimitSelector = false,
    limitOptions = [10, 20, 50, 100],
  } = props;

  // Don't render if there's only one page
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const startIndex = (meta.page - 1) * meta.limit + 1;
  const endIndex = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">
      {/* Info */}
      <div class="text-sm text-slate-600">
        Showing {startIndex} to {endIndex} of {meta.total} results
      </div>

      {/* Controls */}
      <div class="flex items-center gap-4">
        {/* Limit Selector */}
        {showLimitSelector && onLimitChange && (
          <select
            class="h-9 px-3 py-1 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500"
            value={meta.limit}
            onChange={(e) => onLimitChange(Number(e.currentTarget.value))}
          >
            {limitOptions.map((limit) => (
              <option key={limit} value={limit}>
                {limit} per page
              </option>
            ))}
          </select>
        )}

        {/* Navigation */}
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasPrevious}
            onClick={() => onPageChange(meta.page - 1)}
          >
            Previous
          </Button>

          <span class="flex items-center px-3 text-sm font-medium text-slate-600">
            Page {meta.page} of {meta.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasNext}
            onClick={() => onPageChange(meta.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
