import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import type { AdminOrderSummary, OrderStatus } from "~/lib/api/endpoints/orders";

const statusVariant: Record<
  OrderStatus,
  "success" | "warning" | "danger" | "neutral"
> = {
  PENDING_PAYMENT: "warning",
  CONFIRMED: "neutral",
  PROCESSING: "warning",
  SHIPPED: "neutral",
  DELIVERED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
  EXPIRED: "danger",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatCurrency = (value: string) => `৳ ${Number(value).toLocaleString()}`;

export interface OrdersTableProps {
  orders: AdminOrderSummary[];
  showShop?: boolean;
}

export function OrdersTable(props: OrdersTableProps) {
  return (
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-slate-200 bg-slate-50">
            <tr class="text-left text-xs font-semibold uppercase text-slate-600">
              <th class="px-6 py-3">Order</th>
              <Show when={props.showShop !== false}>
                <th class="px-6 py-3">Shop</th>
              </Show>
              <th class="px-6 py-3">Customer</th>
              <th class="px-6 py-3 text-right">Total</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <Show
              when={props.orders.length > 0}
              fallback={
                <tr>
                  <td
                    colSpan={props.showShop === false ? 6 : 7}
                    class="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No orders found.
                  </td>
                </tr>
              }
            >
              <For each={props.orders}>
                {(order) => (
                  <tr class="hover:bg-slate-50">
                    <td class="px-6 py-4">
                      <div class="font-medium text-slate-900">{order.orderNumber}</div>
                      <div class="text-xs text-slate-500">{order.itemCount} items</div>
                    </td>
                    <Show when={props.showShop !== false}>
                      <td class="px-6 py-4">
                        <Show
                          when={order.shop.slug}
                          fallback={<span class="text-sm text-slate-700">{order.shop.name ?? "—"}</span>}
                        >
                          <A
                            href={`/shops/${order.shop.id}`}
                            class="text-sm font-medium text-primary-green-700 hover:underline"
                          >
                            {order.shop.name ?? order.shop.slug}
                          </A>
                        </Show>
                      </td>
                    </Show>
                    <td class="px-6 py-4">
                      <div class="text-sm text-slate-900">{order.buyer.name}</div>
                      <Show when={order.buyer.email}>
                        <div class="text-xs text-slate-500">{order.buyer.email}</div>
                      </Show>
                    </td>
                    <td class="px-6 py-4 text-right text-sm font-medium text-slate-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td class="px-6 py-4">
                      <Badge variant={statusVariant[order.status]} size="sm">
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <A
                        href={`/orders/${order.id}`}
                        class="text-sm font-medium text-primary-green-700 hover:underline"
                      >
                        View
                      </A>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}
