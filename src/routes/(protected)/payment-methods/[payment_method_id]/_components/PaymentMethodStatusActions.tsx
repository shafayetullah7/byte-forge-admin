import { Show } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import type { PaymentMethod } from "~/lib/api/endpoints/payment-methods";

export interface PaymentMethodStatusActionsProps {
  method: PaymentMethod;
  isLastActive: boolean;
  confirmMode: "activate" | "deactivate" | null;
  onConfirmModeChange: (mode: "activate" | "deactivate" | null) => void;
  actionLoading: boolean;
  actionError: string | null;
  onActivate: () => void;
  onDeactivate: () => void;
}

export function PaymentMethodStatusActions(props: PaymentMethodStatusActionsProps) {
  return (
    <Card class="p-6 border-slate-200">
      <h2 class="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
        Status actions
      </h2>

      <Show when={props.method.status === "INACTIVE"}>
        <Show
          when={props.confirmMode === "activate"}
          fallback={
            <Button
              variant="primary"
              class="w-full"
              onClick={() => {
                props.onConfirmModeChange("activate");
              }}
            >
              Activate for checkout
            </Button>
          }
        >
          <div class="space-y-3 p-4 rounded-xl bg-primary-green-50 border border-primary-green-200">
            <p class="text-sm text-slate-700">
              Activate <strong>{props.method.displayName}</strong>? Buyers will be able to select
              this method at checkout.
            </p>
            <Show when={props.actionError}>
              <p class="text-xs text-red-600">{props.actionError}</p>
            </Show>
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                class="flex-1"
                onClick={() => props.onConfirmModeChange(null)}
                disabled={props.actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                class="flex-1"
                isLoading={props.actionLoading}
                onClick={props.onActivate}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Show>
      </Show>

      <Show when={props.method.status === "ACTIVE"}>
        <Show
          when={props.confirmMode === "deactivate"}
          fallback={
            <Button
              variant="danger"
              class="w-full"
              onClick={() => {
                props.onConfirmModeChange("deactivate");
              }}
            >
              Deactivate
            </Button>
          }
        >
          <div class="space-y-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <p class="text-sm text-slate-700">
              Deactivate <strong>{props.method.displayName}</strong>? It will be hidden from
              checkout.
            </p>
            <Show when={props.isLastActive}>
              <p class="text-xs text-red-800 bg-white/80 border border-red-200 rounded-lg p-2">
                This is the only active payment method. Deactivating it would leave checkout with no
                payment options.
              </p>
            </Show>
            <Show when={props.actionError}>
              <p class="text-xs text-red-600">{props.actionError}</p>
            </Show>
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                class="flex-1"
                onClick={() => props.onConfirmModeChange(null)}
                disabled={props.actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                class="flex-1"
                isLoading={props.actionLoading}
                onClick={props.onDeactivate}
                disabled={props.isLastActive}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Show>
      </Show>
    </Card>
  );
}
