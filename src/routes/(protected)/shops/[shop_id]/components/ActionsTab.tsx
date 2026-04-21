import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";

export function ActionsTab() {
  return (
    <div class="space-y-6">
      <div class="bg-green-50 border border-green-200 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-green-900">Shop is Active</h3>
            <p class="text-sm text-green-700 mt-1">
              This shop is currently active and visible to customers.
            </p>
          </div>
          <Badge variant="success">ACTIVE</Badge>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 border border-red-200 rounded-lg bg-red-50">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-sm font-semibold text-red-900">Suspend Shop</h4>
                <p class="text-xs text-red-700 mt-1">
                  Temporarily hide shop from customers. Seller will be notified.
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
              </svg>
            </div>
            <Button variant="danger" size="md" class="mt-3 w-full">Suspend Shop</Button>
          </div>

          <div class="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-sm font-semibold text-slate-900">Deactivate Shop</h4>
                <p class="text-xs text-slate-600 mt-1">
                  Permanently deactivate. Shop will be hidden.
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-600">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <Button variant="outline" size="md" class="mt-3 w-full">Deactivate Shop</Button>
          </div>

          <div class="p-4 border border-green-200 rounded-lg bg-green-50">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-sm font-semibold text-green-900">Reactivate Shop</h4>
                <p class="text-xs text-green-700 mt-1">
                  Restore suspended or deactivated shop to active status.
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </div>
            <Button variant="primary" size="md" class="mt-3 w-full">Reactivate Shop</Button>
          </div>

          <div class="p-4 border border-red-200 rounded-lg bg-red-50">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-sm font-semibold text-red-900">Delete Shop</h4>
                <p class="text-xs text-red-700 mt-1">
                  Permanently delete shop and all associated data. Cannot be undone.
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <Button variant="danger" size="md" class="mt-3 w-full">Delete Shop</Button>
          </div>
        </div>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-600">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 1 1.71 3h16.94a2 2 0 0 1 1.71-3l-8.47-14.14a2 2 0 0 1-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <p class="text-sm text-amber-900">
            All actions require confirmation. Sellers will be notified of any status changes.
          </p>
        </div>
      </div>
    </div>
  );
}