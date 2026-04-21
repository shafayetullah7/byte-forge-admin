import { useParams } from "@solidjs/router";
import { Badge } from "~/components/ui/Badge";

export default function AddressRoute() {
  const params = useParams();
  const shopId = params.shop_id;

  return (
    <div class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900">Address Details</h3>
          <Badge variant="success">Verified</Badge>
        </div>
        
        <p class="text-sm text-slate-900 font-mono mb-6">{shopId}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Country</label>
              <p class="text-slate-900 mt-1">Bangladesh</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Division</label>
              <p class="text-slate-900 mt-1">Dhaka</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">District/City</label>
              <p class="text-slate-900 mt-1">Dhaka</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Street Address</label>
              <p class="text-slate-900 mt-1">House 45, Road 12, Dhanmondi</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-500 uppercase">Postal Code</label>
              <p class="text-slate-900 mt-1 font-mono">1205</p>
            </div>
          </div>

          <div class="h-[200px] bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 mx-auto">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p class="text-sm text-slate-500 mt-2">Map View</p>
              <p class="text-xs text-slate-400">Lat: 23.7461, Long: 90.3742</p>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-200">
          <a
            href="https://maps.google.com/?q=23.7461,90.3742"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
