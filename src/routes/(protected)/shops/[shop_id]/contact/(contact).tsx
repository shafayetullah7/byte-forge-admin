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

export default function ContactRoute() {
  const params = useParams();
  const shop = createAsync(() => getShopDetail(params.shop_id!));

  return (
    <Suspense fallback={<div class="text-sm text-slate-500">Loading contact...</div>}>
      <Show when={shop()}>
        {(data) => (
          <div class="rounded-xl border border-slate-200 bg-white p-6">
            <h3 class="mb-4 text-lg font-semibold text-slate-900">Contact information</h3>
            <Show
              when={data().contact}
              fallback={<p class="text-sm text-slate-500">No contact details on file.</p>}
            >
              {(contact) => (
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DetailRow label="Business email" value={contact().businessEmail} />
                  <DetailRow label="Phone" value={contact().phone} />
                  <DetailRow label="Alternative phone" value={contact().alternativePhone} />
                  <DetailRow label="WhatsApp" value={contact().whatsapp} />
                  <DetailRow label="Telegram" value={contact().telegram} />
                  <DetailRow label="Facebook" value={contact().facebook} />
                  <DetailRow label="Instagram" value={contact().instagram} />
                  <DetailRow label="X / Twitter" value={contact().x} />
                </div>
              )}
            </Show>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
