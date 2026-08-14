import { For, Show } from "solid-js";
import { Card } from "~/components/ui/Card";
import type { PreviewGroupRow } from "~/lib/api/endpoints/tag-groups/tag-groups-bulk-import.types";

function StatusBadge(props: { status: string }) {
  const classes = () => {
    switch (props.status) {
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      case "skipped":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "created":
        return "bg-primary-green-100 text-primary-green-800 border-primary-green-200";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200";
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

export function TagImportPreview(props: { groups: PreviewGroupRow[] }) {
  return (
    <div class="space-y-4">
      <For each={props.groups}>
        {(group) => (
          <Card class="overflow-hidden border-slate-200">
            <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-slate-900">{group.nameEn}</h3>
                  <StatusBadge status={group.status} />
                  <Show when={group.existing}>
                    <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Existing group
                    </span>
                  </Show>
                </div>
                <p class="text-sm text-slate-600 mt-1">
                  <span class="font-mono text-slate-800">{group.slug}</span>
                  <span class="mx-2 text-slate-300">·</span>
                  {group.nameBn}
                </p>
                <Show when={group.message}>
                  <p class="text-xs text-red-600 mt-2">{group.message}</p>
                </Show>
              </div>
              <div class="text-xs text-slate-500">
                {group.isActive ? "Active" : "Inactive"} · {group.tags.length} tag
                {group.tags.length === 1 ? "" : "s"}
              </div>
            </div>

            <Show
              when={group.tags.length > 0}
              fallback={
                <div class="px-5 py-4 text-sm text-slate-500">No tags in this group.</div>
              }
            >
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 text-left text-[11px] uppercase tracking-wider text-slate-500">
                      <th class="px-5 py-3">English</th>
                      <th class="px-5 py-3">Bengali</th>
                      <th class="px-5 py-3">Slug</th>
                      <th class="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={group.tags}>
                      {(tag) => (
                        <tr class="border-b border-slate-50 last:border-0">
                          <td class="px-5 py-3 text-slate-900">{tag.nameEn}</td>
                          <td class="px-5 py-3 text-slate-700">{tag.nameBn}</td>
                          <td class="px-5 py-3 font-mono text-slate-600">{tag.slug}</td>
                          <td class="px-5 py-3">
                            <div class="space-y-1">
                              <StatusBadge status={tag.status} />
                              <Show when={tag.message}>
                                <p class="text-xs text-red-600">{tag.message}</p>
                              </Show>
                            </div>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </Card>
        )}
      </For>
    </div>
  );
}
