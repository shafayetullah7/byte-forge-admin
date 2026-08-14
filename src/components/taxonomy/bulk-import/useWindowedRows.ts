import { createMemo, createSignal, Show } from "solid-js";
import { Button } from "~/components/ui/Button";

const DEFAULT_PAGE_SIZE = 100;

export function useWindowedRows<T>(rows: () => T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [showAll, setShowAll] = createSignal(false);

  const visibleRows = createMemo(() => {
    const allRows = rows();
    if (showAll() || allRows.length <= pageSize) {
      return allRows;
    }
    return allRows.slice(0, pageSize);
  });

  const hiddenCount = createMemo(() => {
    const total = rows().length;
    if (showAll() || total <= pageSize) return 0;
    return total - pageSize;
  });

  return {
    visibleRows,
    hiddenCount,
    showAll,
    setShowAll,
    pageSize,
  };
}

export function WindowedRowsFooter(props: {
  hiddenCount: number;
  onShowAll: () => void;
}) {
  return (
    <Show when={props.hiddenCount > 0}>
      <div class="border-t border-slate-100 bg-slate-50 px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p class="text-sm text-slate-600">
          Showing first rows only for performance ({props.hiddenCount} more hidden).
        </p>
        <Button type="button" variant="outline" size="sm" onClick={props.onShowAll}>
          Show all rows
        </Button>
      </div>
    </Show>
  );
}
