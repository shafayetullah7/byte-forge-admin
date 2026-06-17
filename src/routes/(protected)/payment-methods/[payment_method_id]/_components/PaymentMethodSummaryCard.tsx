import { Show } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import type { PaymentMethod } from "~/lib/api/endpoints/payment-methods";
import { PaymentMethodLogo } from "../../components/PaymentMethodLogo";
import { formatDate } from "../../components/format-date";

export function PaymentMethodSummaryCard(props: { method: PaymentMethod }) {
  return (
    <Card class="p-6">
      <div class="flex items-start gap-4 mb-6">
        <PaymentMethodLogo method={props.method} size="lg" />
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{props.method.displayName}</h1>
          <div class="flex items-center gap-2 mt-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {props.method.key}
            </span>
            <Badge
              variant={props.method.status === "ACTIVE" ? "success" : "secondary"}
              size="sm"
            >
              {props.method.status}
            </Badge>
          </div>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
            <div>
              <dt class="text-slate-500">Created</dt>
              <dd class="text-slate-800 font-medium">{formatDate(props.method.createdAt)}</dd>
            </div>
            <div>
              <dt class="text-slate-500">Last updated</dt>
              <dd class="text-slate-800 font-medium">{formatDate(props.method.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <Show when={props.method.description}>
        <div class="pt-4 border-t border-slate-100">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Description
          </p>
          <p class="text-sm text-slate-700">{props.method.description}</p>
        </div>
      </Show>
    </Card>
  );
}
