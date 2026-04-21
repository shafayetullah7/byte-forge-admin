import { useParams } from "@solidjs/router";
import { For } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";

const mockOrders = [
  { id: "ORD-001", customer: "John Doe", total: 4500, status: "completed", date: "2024-01-18" },
  { id: "ORD-002", customer: "Jane Smith", total: 2300, status: "processing", date: "2024-01-17" },
  { id: "ORD-003", customer: "Bob Johnson", total: 1800, status: "pending", date: "2024-01-16" },
  { id: "ORD-004", customer: "Alice Brown", total: 5600, status: "completed", date: "2024-01-15" },
  { id: "ORD-005", customer: "Charlie Wilson", total: 920, status: "cancelled", date: "2024-01-14" },
];

const statusConfig: Record<string, { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
  completed: { variant: "success", label: "Completed" },
  processing: { variant: "warning", label: "Processing" },
  pending: { variant: "neutral", label: "Pending" },
  cancelled: { variant: "danger", label: "Cancelled" },
};

export default function OrdersRoute() {
  const params = useParams();
  const shopId = params.shop_id;

  return (
    <div class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <span class="text-sm text-slate-500">Shop ID: {shopId}</span>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <p class="text-2xl font-bold text-slate-900">1,247</p>
          <p class="text-xs text-slate-500 mt-1">Total Orders</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <p class="text-2xl font-bold text-emerald-600">892</p>
          <p class="text-xs text-slate-500 mt-1">Completed</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <p class="text-2xl font-bold text-amber-600">45</p>
          <p class="text-xs text-slate-500 mt-1">Processing</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <p class="text-2xl font-bold text-red-600">23</p>
          <p class="text-xs text-slate-500 mt-1">Cancelled</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search orders..."
            class="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-green-500"
          />
          <select class="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option>All Status</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr class="text-xs font-semibold text-slate-600 uppercase">
                <th class="px-6 py-3 text-left">Order ID</th>
                <th class="px-6 py-3 text-left">Customer</th>
                <th class="px-6 py-3 text-right">Total</th>
                <th class="px-6 py-3 text-center">Status</th>
                <th class="px-6 py-3 text-left">Date</th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <For each={mockOrders}>
                {(order) => {
                  const config = statusConfig[order.status];
                  return (
                    <tr class="hover:bg-slate-50">
                      <td class="px-6 py-4 text-sm font-mono text-slate-900">{order.id}</td>
                      <td class="px-6 py-4 text-sm text-slate-700">{order.customer}</td>
                      <td class="px-6 py-4 text-sm text-slate-900 text-right font-medium">৳ {order.total}</td>
                      <td class="px-6 py-4 text-center">
                        <Badge variant={config.variant} size="sm">{config.label}</Badge>
                      </td>
                      <td class="px-6 py-4 text-sm text-slate-500">
                        {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td class="px-6 py-4 text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  );
                }}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
