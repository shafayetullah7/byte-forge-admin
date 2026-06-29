import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { For, Show, Suspense } from "solid-js";
import { Meta, Title } from "@solidjs/meta";
import { Badge } from "~/components/ui/Badge";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { UsersIcon } from "~/components/icons";
import { getAdminUser, getAdminUserOrders } from "~/lib/api/endpoints/users";

export const route: RouteDefinition = {
  preload: ({ params }) => Promise.all([
    getAdminUser(params.user_id!),
    getAdminUserOrders(params.user_id!),
  ]),
};

export default function CustomerDetailPage() {
  const params = useParams();
  const user = createAsync(() => getAdminUser(params.user_id!));
  const orders = createAsync(() => getAdminUserOrders(params.user_id!));

  return (
    <PageShell>
      <Title>{user() ? `${user()!.firstName} ${user()!.lastName}` : "Customer"} | ByteForge Admin</Title>

      <Suspense fallback={<div class="text-sm text-slate-500">Loading customer...</div>}>
        <Show when={user()}>
          {(data) => (
            <>
              <PageHeader
                title={`${data().firstName} ${data().lastName}`}
                description={`@${data().userName} · Joined ${new Date(data().createdAt).toLocaleDateString()}`}
                icon={UsersIcon}
              />

              <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Email</p>
                  <p class="mt-2 text-sm font-medium text-slate-900">{data().email ?? "—"}</p>
                  <p class="text-xs text-slate-500">
                    {data().emailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Orders</p>
                  <p class="mt-2 text-2xl font-bold text-slate-900">{data().orderStats.total}</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Delivered</p>
                  <p class="mt-2 text-2xl font-bold text-emerald-600">{data().orderStats.delivered}</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                  <p class="text-xs font-semibold uppercase text-slate-500">Revenue</p>
                  <p class="mt-2 text-2xl font-bold text-slate-900">
                    ৳ {Number(data().orderStats.revenue).toLocaleString()}
                  </p>
                </div>
              </div>

              <div class="rounded-xl border border-slate-200 bg-white p-6">
                <h3 class="mb-4 text-lg font-semibold text-slate-900">Recent orders</h3>
                <Show
                  when={(orders()?.data.length ?? 0) > 0}
                  fallback={<p class="text-sm text-slate-500">No orders yet.</p>}
                >
                  <div class="divide-y divide-slate-100">
                    <For each={orders()?.data ?? []}>
                      {(order) => (
                        <div class="flex flex-wrap items-center justify-between gap-4 py-4">
                          <div>
                            <p class="font-medium text-slate-900">{order.orderNumber}</p>
                            <p class="text-xs text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString()} · {order.shop.name}
                            </p>
                          </div>
                          <div class="flex items-center gap-4">
                            <Badge variant="neutral" size="sm">
                              {order.status.replace(/_/g, " ")}
                            </Badge>
                            <span class="text-sm font-medium text-slate-900">
                              ৳ {Number(order.total).toLocaleString()}
                            </span>
                            <A
                              href={`/orders/${order.id}`}
                              class="text-sm font-medium text-primary-green-700 hover:underline"
                            >
                              View
                            </A>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </>
          )}
        </Show>
      </Suspense>
    </PageShell>
  );
}
