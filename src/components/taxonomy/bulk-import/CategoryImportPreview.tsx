import { For, Show } from "solid-js";
import { Card } from "~/components/ui/Card";
import type { PreviewCategoryRow } from "~/lib/api/endpoints/categories/categories-bulk-import.types";

function StatusBadge(props: { status: string }) {
  const classes = () => {
    switch (props.status) {
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "skipped":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "created":
        return "bg-primary-green-100 text-primary-green-800 border-primary-green-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <span class={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border ${classes()}`}>
      {props.status}
    </span>
  );
}

export function CategoryImportPreview(props: { rows: PreviewCategoryRow[] }) {
  return (
    <Card class="overflow-hidden border-slate-200">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/80 text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th class="px-5 py-3">Category</th>
              <th class="px-5 py-3">Parent</th>
              <th class="px-5 py-3">Depth</th>
              <th class="px-5 py-3">Slug</th>
              <th class="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.rows}>
              {(row) => (
                <tr class="border-b border-slate-50 last:border-0">
                  <td class="px-5 py-3">
                    <div style={{ "padding-left": `${row.depth * 1.25}rem` }}>
                      <p class="font-medium text-slate-900">{row.nameEn}</p>
                      <p class="text-slate-600">{row.nameBn}</p>
                    </div>
                  </td>
                  <td class="px-5 py-3 text-slate-700">{row.parentPath}</td>
                  <td class="px-5 py-3">
                    Level {row.depth + 1}
                    <span class="text-slate-400"> / 3</span>
                  </td>
                  <td class="px-5 py-3 font-mono text-slate-600">{row.slug}</td>
                  <td class="px-5 py-3">
                    <div class="space-y-1">
                      <StatusBadge status={row.status} />
                      <Show when={row.message}>
                        <p class="text-xs text-slate-600">{row.message}</p>
                      </Show>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
