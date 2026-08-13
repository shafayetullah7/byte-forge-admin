import { For, Show } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import type { ShopSubscriptionInvoiceSummary } from "~/lib/api/endpoints/shop-subscription";
import { formatBdtAmount, formatSubscriptionDate } from "./subscription-formatters";

export function RecentInvoicesSnippet(props: {
  invoices: ShopSubscriptionInvoiceSummary[];
}) {
  return (
    <Card class="p-6 border-slate-200">
      <h3 class="text-base font-bold text-slate-900 mb-4">Recent invoices</h3>
      <Show
        when={props.invoices.length > 0}
        fallback={
          <p class="text-sm text-slate-500 py-6 text-center">
            No subscription invoices yet for this shop.
          </p>
        }
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="px-3 py-2">Date</th>
                <th class="px-3 py-2">Amount</th>
                <th class="px-3 py-2">Provider</th>
                <th class="px-3 py-2">Status</th>
                <th class="px-3 py-2">Period end</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <For each={props.invoices}>
                {(invoice) => (
                  <tr class="text-sm">
                    <td class="px-3 py-3 text-slate-600">
                      {formatSubscriptionDate(invoice.paidAt ?? invoice.createdAt)}
                    </td>
                    <td class="px-3 py-3 font-medium text-slate-900">
                      {formatBdtAmount(invoice.amountBdt, invoice.currency)}
                    </td>
                    <td class="px-3 py-3 text-slate-600">{invoice.provider}</td>
                    <td class="px-3 py-3">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td class="px-3 py-3 text-slate-600">
                      {formatSubscriptionDate(invoice.periodEnd)}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </Card>
  );
}

function InvoiceStatusBadge(props: { status: string }) {
  const variant =
    props.status === "PAID"
      ? "success"
      : props.status === "PENDING"
        ? "warning"
        : "secondary";
  return (
    <Badge variant={variant} size="sm">
      {props.status}
    </Badge>
  );
}
