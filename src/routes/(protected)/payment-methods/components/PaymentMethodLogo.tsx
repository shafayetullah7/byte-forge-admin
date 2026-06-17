import { Show } from "solid-js";
import type { PaymentMethod } from "~/lib/api/endpoints/payment-methods";

export function PaymentMethodLogo(props: {
  method: Pick<PaymentMethod, "key" | "displayName" | "logoUrl">;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = () => {
    switch (props.size ?? "md") {
      case "sm":
        return "w-8 h-8 text-base";
      case "lg":
        return "w-14 h-14 text-2xl";
      default:
        return "w-10 h-10 text-lg";
    }
  };

  return (
    <div
      class={`${sizeClass()} rounded-lg bg-primary-green-50 border border-primary-green-100 flex items-center justify-center overflow-hidden flex-shrink-0`}
    >
      <Show
        when={props.method.logoUrl}
        fallback={
          <span class="font-bold text-primary-green-700">
            {props.method.key.slice(0, 2)}
          </span>
        }
      >
        {(url) => (
          <img
            src={url()}
            alt={props.method.displayName}
            class="w-full h-full object-contain p-1"
          />
        )}
      </Show>
    </div>
  );
}
