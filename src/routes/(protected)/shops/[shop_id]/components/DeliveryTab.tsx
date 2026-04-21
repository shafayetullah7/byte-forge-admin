import { Badge } from "~/components/ui/Badge";
import { For } from "solid-js";

const deliveryOptions = [
  { label: "Local Delivery", enabled: true, description: "Within Dhaka city" },
  { label: "Nationwide Shipping", enabled: true, description: "All districts of Bangladesh" },
  { label: "In-Store Pickup", enabled: true, description: "Pickup from shop location" },
  { label: "International Shipping", enabled: false, description: "Not available" },
];

export function DeliveryTab() {
  return (
    <div class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Delivery Options</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={deliveryOptions}>
            {(option) => (
              <div class="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-slate-900">{option.label}</p>
                  <p class="text-xs text-slate-500 mt-1">{option.description}</p>
                </div>
                <Badge variant={option.enabled ? "success" : "neutral"} size="sm">
                  {option.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Delivery Information</h3>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase">Delivery Area</label>
            <p class="text-slate-700 mt-1">
              We deliver within Dhaka city and all major districts across Bangladesh. Delivery time varies based on location.
            </p>
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase">Minimum Delivery Time</label>
            <p class="text-slate-900 mt-1 font-medium">1-2 business days</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-500 uppercase">Business Hours</label>
            <p class="text-slate-700 mt-1">Mon-Sat: 9AM-6PM, Sun: 10AM-4PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}