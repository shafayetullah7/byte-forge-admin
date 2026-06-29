import { A } from "@solidjs/router";

export function DashboardRecentActivity() {
  return (
    <div class="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-base font-semibold text-slate-900">Quick links</h2>
      <ul class="space-y-3 text-sm">
        <li>
          <A href="/shops?verificationStatus=PENDING" class="font-medium text-primary-green-700 hover:underline">
            Review pending shops
          </A>
        </li>
        <li>
          <A href="/orders" class="font-medium text-primary-green-700 hover:underline">
            Search orders
          </A>
        </li>
        <li>
          <A href="/products" class="font-medium text-primary-green-700 hover:underline">
            Moderate products
          </A>
        </li>
        <li>
          <A href="/reviews" class="font-medium text-primary-green-700 hover:underline">
            Moderate reviews
          </A>
        </li>
        <li>
          <A href="/customers" class="font-medium text-primary-green-700 hover:underline">
            Find customers
          </A>
        </li>
      </ul>
    </div>
  );
}
