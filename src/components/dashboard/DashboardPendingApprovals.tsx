import { A, createAsync } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { getShops } from "~/lib/api/endpoints/shops";

export function DashboardPendingApprovals() {
  const pendingShops = createAsync(() =>
    getShops({ verificationStatus: "PENDING", limit: 5 }),
  );

  return (
    <div class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
        <h2 class="text-base font-semibold text-slate-900">Pending verifications</h2>
        <A href="/shops?verificationStatus=PENDING" class="text-sm font-medium text-primary-green hover:underline">
          Manage all
        </A>
      </div>
      <Suspense
        fallback={<div class="h-40 animate-pulse bg-slate-50" />}
      >
        <Show
          when={(pendingShops()?.data.length ?? 0) > 0}
          fallback={
            <div class="px-5 py-10 text-center text-sm text-slate-500">
              No shops awaiting verification.
            </div>
          }
        >
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="border-b border-slate-100 bg-white text-[11px] uppercase tracking-widest text-slate-400">
                  <th class="px-5 py-3 font-medium">Shop</th>
                  <th class="px-5 py-3 font-medium">Applied</th>
                  <th class="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <For each={pendingShops()?.data ?? []}>
                  {(shop) => (
                    <tr class="group transition-colors hover:bg-slate-50">
                      <td class="px-5 py-4">
                        <div class="font-medium text-slate-900">{shop.nameEn ?? shop.slug}</div>
                        <div class="mt-0.5 text-xs text-slate-500">{shop.slug}</div>
                      </td>
                      <td class="px-5 py-4 text-slate-500">
                        {new Date(shop.createdAt).toLocaleDateString()}
                      </td>
                      <td class="px-5 py-4 text-right">
                        <A
                          href={`/shops/${shop.id}/verification`}
                          class="text-sm font-medium text-primary-green-700 opacity-100 hover:underline"
                        >
                          Review
                        </A>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Suspense>
    </div>
  );
}
