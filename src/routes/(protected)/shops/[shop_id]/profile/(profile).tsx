import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { getShopDetail } from "~/lib/api/endpoints/shops";

export const route: RouteDefinition = {
  preload: ({ params }) => getShopDetail(params.shop_id!),
};

export default function ProfileRoute() {
  const params = useParams();
  const shop = createAsync(() => getShopDetail(params.shop_id!));

  return (
    <Suspense fallback={<div class="text-sm text-slate-500">Loading profile...</div>}>
      <Show when={shop()}>
        {(data) => (
          <div class="space-y-6">
            <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div class="relative h-32 bg-gradient-to-r from-green-500 to-green-700">
                <Show when={data().banner}>
                  <img src={data().banner!} alt="" class="h-full w-full object-cover opacity-60" />
                </Show>
              </div>
              <div class="relative flex items-end gap-6 p-6">
                <Show
                  when={data().logo}
                  fallback={
                    <div class="flex h-24 w-24 items-center justify-center rounded-xl border-4 border-white bg-slate-100 shadow-lg">
                      <span class="text-2xl font-bold text-slate-400">
                        {data().name.charAt(0)}
                      </span>
                    </div>
                  }
                >
                  <img
                    src={data().logo!}
                    alt={data().name}
                    class="h-24 w-24 rounded-xl border-4 border-white object-cover shadow-lg"
                  />
                </Show>
                <div>
                  <h2 class="text-xl font-bold text-slate-900">{data().name}</h2>
                  <p class="text-sm text-slate-500">{data().slug}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <For each={data().translations}>
                {(translation) => (
                  <div class="rounded-xl border border-slate-200 bg-white p-6">
                    <div class="mb-4 flex items-center gap-2">
                      <span class="text-sm font-semibold text-slate-700">Translation</span>
                      <Badge variant="neutral" size="sm">
                        {translation.locale.toUpperCase()}
                      </Badge>
                    </div>
                    <div class="space-y-4">
                      <div>
                        <label class="text-xs font-semibold uppercase text-slate-500">Name</label>
                        <p class="mt-1 text-slate-900">{translation.name}</p>
                      </div>
                      <div>
                        <label class="text-xs font-semibold uppercase text-slate-500">
                          Description
                        </label>
                        <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                          {translation.description || "—"}
                        </p>
                      </div>
                      <div>
                        <label class="text-xs font-semibold uppercase text-slate-500">
                          Business hours
                        </label>
                        <p class="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                          {translation.businessHours || "—"}
                        </p>
                      </div>
                      <Show when={translation.tagline}>
                        <div>
                          <label class="text-xs font-semibold uppercase text-slate-500">
                            Tagline
                          </label>
                          <p class="mt-1 text-sm text-slate-700">{translation.tagline}</p>
                        </div>
                      </Show>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
