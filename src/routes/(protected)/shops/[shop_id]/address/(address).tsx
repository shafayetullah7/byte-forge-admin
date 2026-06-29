import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { getShopDetail } from "~/lib/api/endpoints/shops";

export const route: RouteDefinition = {
  preload: ({ params }) => getShopDetail(params.shop_id!),
};

export default function AddressRoute() {
  const params = useParams();
  const shop = createAsync(() => getShopDetail(params.shop_id!));

  return (
    <Suspense fallback={<div class="text-sm text-slate-500">Loading address...</div>}>
      <Show when={shop()}>
        {(data) => (
          <div class="space-y-6">
            <Show
              when={data().address}
              fallback={
                <div class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                  No address on file.
                </div>
              }
            >
              {(address) => (
                <>
                  <div class="rounded-xl border border-slate-200 bg-white p-6">
                    <div class="mb-4 flex items-center justify-between">
                      <h3 class="text-lg font-semibold text-slate-900">Address details</h3>
                      <Badge variant={address().isVerified ? "success" : "neutral"}>
                        {address().isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label class="text-xs font-semibold uppercase text-slate-500">
                          Postal code
                        </label>
                        <p class="mt-1 text-sm text-slate-900">{address().postalCode}</p>
                      </div>
                      <div>
                        <label class="text-xs font-semibold uppercase text-slate-500">
                          Coordinates
                        </label>
                        <p class="mt-1 text-sm text-slate-900">
                          {address().latitude && address().longitude
                            ? `${address().latitude}, ${address().longitude}`
                            : "—"}
                        </p>
                      </div>
                      <div class="md:col-span-2">
                        <label class="text-xs font-semibold uppercase text-slate-500">
                          Google Maps
                        </label>
                        <Show
                          when={address().googleMapsLink}
                          fallback={<p class="mt-1 text-sm text-slate-900">—</p>}
                        >
                          <a
                            href={address().googleMapsLink!}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="mt-1 block text-sm text-primary-green-700 hover:underline"
                          >
                            Open in Google Maps
                          </a>
                        </Show>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <For each={address().translations}>
                      {(translation) => (
                        <div class="rounded-xl border border-slate-200 bg-white p-6">
                          <div class="mb-4 flex items-center gap-2">
                            <span class="text-sm font-semibold text-slate-700">Address</span>
                            <Badge variant="neutral" size="sm">
                              {translation.locale.toUpperCase()}
                            </Badge>
                          </div>
                          <div class="space-y-3 text-sm text-slate-700">
                            <p>{translation.street || "—"}</p>
                            <p>
                              {[translation.district, translation.division, translation.country]
                                .filter(Boolean)
                                .join(", ") || "—"}
                            </p>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </>
              )}
            </Show>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
