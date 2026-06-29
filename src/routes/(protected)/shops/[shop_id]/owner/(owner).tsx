import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { getShopDetail } from "~/lib/api/endpoints/shops";

export const route: RouteDefinition = {
  preload: ({ params }) => getShopDetail(params.shop_id!),
};

export default function OwnerRoute() {
  const params = useParams();
  const shop = createAsync(() => getShopDetail(params.shop_id!));

  return (
    <Suspense fallback={<div class="text-sm text-slate-500">Loading owner...</div>}>
      <Show when={shop()}>
        {(data) => (
          <div class="rounded-xl border border-slate-200 bg-white p-6">
            <h3 class="mb-4 text-lg font-semibold text-slate-900">Shop owner</h3>
            <Show
              when={data().owner}
              fallback={<p class="text-sm text-slate-500">No owner record found.</p>}
            >
              {(owner) => (
                <div class="flex flex-col gap-6 md:flex-row md:items-start">
                  <Show
                    when={owner().avatar}
                    fallback={
                      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-500">
                        {owner().firstName.charAt(0)}
                        {owner().lastName.charAt(0)}
                      </div>
                    }
                  >
                    <img
                      src={owner().avatar!}
                      alt={owner().userName}
                      class="h-20 w-20 rounded-full object-cover"
                    />
                  </Show>
                  <div class="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label class="text-xs font-semibold uppercase text-slate-500">Name</label>
                      <p class="mt-1 text-sm text-slate-900">
                        {owner().firstName} {owner().lastName}
                      </p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold uppercase text-slate-500">Username</label>
                      <p class="mt-1 text-sm text-slate-900">@{owner().userName}</p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold uppercase text-slate-500">Email</label>
                      <p class="mt-1 text-sm text-slate-900">{owner().email ?? "—"}</p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold uppercase text-slate-500">
                        Email verified
                      </label>
                      <div class="mt-1">
                        <Badge variant={owner().emailVerified ? "success" : "warning"}>
                          {owner().emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs font-semibold uppercase text-slate-500">
                        Member since
                      </label>
                      <p class="mt-1 text-sm text-slate-900">
                        {new Date(owner().memberSince).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold uppercase text-slate-500">User ID</label>
                      <p class="mt-1 font-mono text-sm text-slate-900">{owner().id}</p>
                    </div>
                  </div>
                </div>
              )}
            </Show>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
