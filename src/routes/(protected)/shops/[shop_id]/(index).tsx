import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getShopDetail } from "~/lib/api/endpoints/shops";

function DetailRow(props: { label: string; value?: string | null }) {
  return (
    <div>
      <label class="text-xs font-semibold uppercase text-slate-500">{props.label}</label>
      <p class="mt-1 text-sm text-slate-900">{props.value?.trim() ? props.value : "—"}</p>
    </div>
  );
}

export const route: RouteDefinition = {
  preload: ({ params }) => getShopDetail(params.shop_id!),
};

export default function DashboardRoute() {
  const params = useParams();
  const shop = createAsync(() => getShopDetail(params.shop_id!));

  const enAddress = () =>
    shop()?.address?.translations.find((t) => t.locale === "en") ??
    shop()?.address?.translations[0];

  return (
    <Suspense fallback={<div class="text-sm text-slate-500">Loading overview...</div>}>
      <Show when={shop()}>
        {(data) => (
          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div class="rounded-xl border border-slate-200 bg-white p-5">
                <p class="text-xs font-semibold uppercase text-slate-500">Status</p>
                <p class="mt-2 text-lg font-semibold text-slate-900">{data().status}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-5">
                <p class="text-xs font-semibold uppercase text-slate-500">Verification</p>
                <p class="mt-2 text-lg font-semibold text-slate-900">
                  {data().verificationStatus ?? "—"}
                </p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-5">
                <p class="text-xs font-semibold uppercase text-slate-500">Marketplace verified</p>
                <p class="mt-2 text-lg font-semibold text-slate-900">
                  {data().isVerified ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-6">
              <h3 class="mb-4 text-lg font-semibold text-slate-900">Shop summary</h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailRow label="Shop ID" value={data().id} />
                <DetailRow label="Slug" value={data().slug} />
                <DetailRow
                  label="Owner"
                  value={
                    data().owner
                      ? `${data().owner!.firstName} ${data().owner!.lastName}`
                      : null
                  }
                />
                <DetailRow
                  label="Location"
                  value={
                    enAddress()
                      ? [enAddress()!.district, enAddress()!.division, enAddress()!.country]
                          .filter(Boolean)
                          .join(", ")
                      : null
                  }
                />
                <DetailRow
                  label="Created"
                  value={new Date(data().createdAt).toLocaleDateString()}
                />
                <DetailRow
                  label="Last updated"
                  value={new Date(data().updatedAt).toLocaleDateString()}
                />
              </div>
            </div>

            <div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              Product and order metrics will appear here once the shop-scoped admin modules are
              connected. Use the Products and Orders tabs for operational data.
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
