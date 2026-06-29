import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { Meta, Title } from "@solidjs/meta";
import { Badge } from "~/components/ui/Badge";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { ShoppingCartIcon } from "~/components/icons";
import { getAdminOrder } from "~/lib/api/endpoints/orders";

export const route: RouteDefinition = {
  preload: ({ params }) => getAdminOrder(params.order_id!),
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function OrderDetailPage() {
  const params = useParams();
  const order = createAsync(() => getAdminOrder(params.order_id!));

  return (
    <PageShell>
      <Title>{order()?.orderNumber ?? "Order"} | ByteForge Admin</Title>

      <Suspense fallback={<div class="text-sm text-slate-500">Loading order...</div>}>
        <Show when={order()}>
          {(data) => (
            <>
              <PageHeader
                title={data().orderNumber}
                description={`Placed ${formatDateTime(data().createdAt)}`}
                icon={ShoppingCartIcon}
              />

              <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Status</p>
                  <div class="mt-2">
                    <Badge variant="neutral">{data().status.replace(/_/g, " ")}</Badge>
                  </div>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Payment</p>
                  <p class="mt-2 text-sm font-medium text-slate-900">
                    {data().paymentMethodDisplayName ?? data().paymentMethodKey}
                  </p>
                  <p class="text-xs text-slate-500">{data().paymentStatus}</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Total</p>
                  <p class="mt-2 text-2xl font-bold text-slate-900">
                    ৳ {Number(data().total).toLocaleString()}
                  </p>
                </div>
              </div>

              <div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div class="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 class="mb-4 text-lg font-semibold text-slate-900">Shop</h3>
                  <div class="space-y-2 text-sm">
                    <p class="font-medium text-slate-900">{data().shop.name ?? "—"}</p>
                    <p class="text-slate-500">{data().shop.slug}</p>
                    <A
                      href={`/shops/${data().shop.id}`}
                      class="inline-block text-primary-green-700 hover:underline"
                    >
                      View shop
                    </A>
                  </div>
                </div>

                <div class="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 class="mb-4 text-lg font-semibold text-slate-900">Buyer</h3>
                  <div class="space-y-2 text-sm">
                    <p class="font-medium text-slate-900">{data().buyer.name}</p>
                    <p class="text-slate-600">{data().buyer.email ?? "No email"}</p>
                    <p class="text-slate-600">{data().buyer.phone ?? "No phone"}</p>
                    <Show when={data().buyer.userName}>
                      <p class="text-slate-500">@{data().buyer.userName}</p>
                    </Show>
                  </div>
                </div>
              </div>

              <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6">
                <h3 class="mb-4 text-lg font-semibold text-slate-900">Items</h3>
                <div class="divide-y divide-slate-100">
                  <For each={data().items}>
                    {(item) => (
                      <div class="flex items-center justify-between gap-4 py-4">
                        <div>
                          <p class="font-medium text-slate-900">{item.productName}</p>
                          <p class="text-xs text-slate-500">
                            Qty {item.quantity}
                            {item.variantTitle ? ` · ${item.variantTitle}` : ""}
                          </p>
                        </div>
                        <p class="text-sm font-medium text-slate-900">
                          ৳ {Number(item.subtotal).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <Show when={data().address}>
                {(address) => (
                  <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6">
                    <h3 class="mb-4 text-lg font-semibold text-slate-900">Delivery address</h3>
                    <div class="text-sm text-slate-700">
                      <p class="font-medium text-slate-900">{address().recipientName}</p>
                      <p>{address().phone}</p>
                      <p class="mt-2">
                        {[address().addressLine1, address().addressLine2]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p>
                        {[address().city, address().state, address().postalCode, address().country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </Show>

              <div class="rounded-xl border border-slate-200 bg-white p-6">
                <h3 class="mb-4 text-lg font-semibold text-slate-900">Status timeline</h3>
                <div class="space-y-4">
                  <For each={data().statusHistory}>
                    {(entry) => (
                      <div class="flex gap-4 border-l-2 border-slate-200 pl-4">
                        <div>
                          <p class="text-sm font-medium text-slate-900">
                            {entry.fromStatus
                              ? `${entry.fromStatus} → ${entry.toStatus}`
                              : entry.toStatus}
                          </p>
                          <p class="text-xs text-slate-500">
                            {entry.actorLabel} · {formatDateTime(entry.createdAt)}
                          </p>
                          <Show when={entry.notes}>
                            <p class="mt-1 text-sm text-slate-600">{entry.notes}</p>
                          </Show>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </>
          )}
        </Show>
      </Suspense>
    </PageShell>
  );
}
