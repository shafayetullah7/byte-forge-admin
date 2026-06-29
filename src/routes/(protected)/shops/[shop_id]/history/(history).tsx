import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { getShopVerification } from "~/lib/api/endpoints/shops";

const actionLabel: Record<string, string> = {
  SUBMITTED: "Verification submitted",
  APPROVED: "Shop approved",
  REJECTED: "Shop rejected",
  SUSPENDED: "Shop suspended",
  DEACTIVATED: "Shop deactivated",
  REACTIVATED: "Shop reactivated",
};

export const route: RouteDefinition = {
  preload: ({ params }) => getShopVerification(params.shop_id!),
};

export default function HistoryRoute() {
  const params = useParams();
  const verification = createAsync(() => getShopVerification(params.shop_id!));

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <Suspense fallback={<div class="text-sm text-slate-500">Loading history...</div>}>
      <Show
        when={verification()}
        fallback={
          <div class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No verification history available.
          </div>
        }
      >
        {(data) => (
          <div class="space-y-6">
            <div class="rounded-xl border border-slate-200 bg-white p-6">
              <h3 class="mb-4 text-lg font-semibold text-slate-900">Verification history</h3>

              <Show
                when={(data().history?.length ?? 0) > 0}
                fallback={
                  <p class="text-sm text-slate-500">No history entries recorded yet.</p>
                }
              >
                <div class="relative">
                  <div class="absolute bottom-0 left-4 top-0 w-0.5 bg-slate-200" />
                  <div class="space-y-4">
                    <For each={data().history ?? []}>
                      {(entry) => (
                        <div class="relative flex items-start gap-4 pl-10">
                          <div class="absolute left-2.5 h-3 w-3 rounded-full border-2 border-white bg-slate-400" />
                          <div class="flex-1 rounded-lg bg-slate-50 p-4">
                            <div class="mb-1 flex items-center justify-between gap-3">
                              <p class="text-sm font-medium text-slate-900">
                                {actionLabel[entry.action] ?? entry.action}
                              </p>
                              <span class="text-xs text-slate-500">
                                {formatDate(entry.timestamp)}
                              </span>
                            </div>
                            <Show when={entry.previousStatus || entry.newStatus}>
                              <p class="text-xs text-slate-600">
                                {entry.previousStatus ?? "—"} → {entry.newStatus ?? "—"}
                              </p>
                            </Show>
                            <Show when={entry.reason}>
                              <p class="mt-2 text-xs text-slate-700">{entry.reason}</p>
                            </Show>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
